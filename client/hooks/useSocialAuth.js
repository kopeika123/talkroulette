"use client";

import { useEffect, useState } from "react";
import * as VKID from "@vkid/sdk";
import {
  clearAuthSession,
  clearVkAuthChallenge,
  createRandomString,
  getAuthBaseUrl,
  getVkRedirectUrl,
  getYandexRedirectUrl,
  readAuthSession,
  saveAuthSession,
  saveVkAuthChallenge,
} from "../lib/auth/socialAuthStorage";
import {
  buildUserName,
  persistSocialSession,
} from "../lib/auth/socialAuthApi";

const YANDEX_MESSAGE_SOURCE = "talkroulette-yandex-auth";

const extractYandexAccessToken = (payload) => {
  if (!payload) {
    return "";
  }

  if (typeof payload === "string") {
    return payload;
  }

  return (
    payload.access_token ||
    payload.accessToken ||
    payload.token ||
    payload.data?.access_token ||
    payload.data?.accessToken ||
    payload.data?.token ||
    ""
  );
};

const waitForYandexTokenMessage = () => {
  return new Promise((resolve, reject) => {
    const timeoutId = window.setTimeout(() => {
      window.removeEventListener("message", handleMessage);
      reject(new Error("Timed out waiting for Yandex token"));
    }, 60000);

    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) {
        return;
      }

      if (!event.data || event.data.source !== YANDEX_MESSAGE_SOURCE) {
        return;
      }

      const accessToken = extractYandexAccessToken(event.data);

      if (!accessToken) {
        return;
      }

      window.clearTimeout(timeoutId);
      window.removeEventListener("message", handleMessage);
      resolve(accessToken);
    };

    window.addEventListener("message", handleMessage);
  });
};

const buildYandexOauthUrl = (clientId) => {
  const url = new URL("https://oauth.yandex.ru/authorize");

  url.searchParams.set("response_type", "token");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", getYandexRedirectUrl());

  return url.toString();
};

const openPopup = (url, title) => {
  const width = 520;
  const height = 720;
  const left = window.screenX + Math.max(0, (window.outerWidth - width) / 2);
  const top = window.screenY + Math.max(0, (window.outerHeight - height) / 2);

  return window.open(
    url,
    title,
    [
      "popup=yes",
      "resizable=yes",
      "scrollbars=yes",
      `width=${width}`,
      `height=${height}`,
      `left=${Math.round(left)}`,
      `top=${Math.round(top)}`,
    ].join(","),
  );
};

export const useSocialAuth = () => {
  const [session, setSession] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  useEffect(() => {
    const storedSession = readAuthSession();

    if (storedSession) {
      setSession(storedSession);
    }

    setIsLoading(false);
  }, []);

  const completeYandexAuth = async (accessToken) => {
    const response = await fetch("https://login.yandex.ru/info?format=json", {
      headers: {
        Authorization: `OAuth ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Unable to fetch Yandex profile");
    }

    const user = await response.json();
    const nextSession = await persistSocialSession({
      provider: "yandex",
      providerUserId: String(user.id ?? user.default_uid ?? ""),
      name:
        user.real_name ||
        user.display_name ||
        user.login ||
        "Пользователь Яндекса",
      email: user.default_email || "",
      avatarUrl: user.default_avatar_id
        ? `https://avatars.yandex.net/get-yapic/${user.default_avatar_id}/islands-200`
        : "",
      accessToken,
    });

    saveAuthSession(nextSession);
    setSession(nextSession);
  };

  const signInWithVk = async () => {
    const appId = process.env.NEXT_PUBLIC_VK_APP_ID;

    if (!appId) {
      setError("Не задан VK APP ID.");
      return;
    }

    setError("");
    setIsAuthorizing(true);

    try {
      const state = createRandomString(32);
      const codeVerifier = createRandomString(96);
      saveVkAuthChallenge({ codeVerifier, state });

      VKID.Config.init({
        app: Number(appId),
        redirectUrl: getVkRedirectUrl(),
        responseMode: VKID.ConfigResponseMode.Callback,
        source: VKID.ConfigSource.LOWCODE,
        state,
        codeVerifier,
        scope: "",
      });

      const floatingOneTap = new VKID.FloatingOneTap();
      const authPayload = await new Promise((resolve, reject) => {
        floatingOneTap
          .render({
            appName: new URL(getAuthBaseUrl()).host,
            showAlternativeLogin: true,
          })
          .on(VKID.WidgetEvents.ERROR, reject)
          .on(VKID.FloatingOneTapInternalEvents.LOGIN_SUCCESS, resolve);
      });

      const token = await VKID.Auth.exchangeCode(
        authPayload.code,
        authPayload.device_id,
        codeVerifier,
      );
      const userInfo = await VKID.Auth.userInfo(token.access_token);
      const user = userInfo.user ?? {};
      const nextSession = await persistSocialSession({
        provider: "vk",
        providerUserId: String(token.user_id ?? user.user_id ?? ""),
        name: buildUserName(
          user.first_name,
          user.last_name,
          "Пользователь VK",
        ),
        email: user.email ?? "",
        avatarUrl: user.avatar ?? "",
        accessToken: token.access_token,
      });

      floatingOneTap.close();
      clearVkAuthChallenge();
      saveAuthSession(nextSession);
      setSession(nextSession);
    } catch (authError) {
      console.error(authError);
      clearVkAuthChallenge();
      setError("Не удалось завершить авторизацию VK.");
    } finally {
      setIsAuthorizing(false);
    }
  };

  const signInWithYandex = async () => {
    const clientId = process.env.NEXT_PUBLIC_YANDEX_CLIENT_ID;

    if (!clientId) {
      setError("Не задан Yandex Client ID.");
      return;
    }

    setError("");
    setIsAuthorizing(true);

    try {
      const messageTokenPromise = waitForYandexTokenMessage();
      const popup = openPopup(buildYandexOauthUrl(clientId), "yandex-auth");

      if (!popup) {
        throw new Error("Yandex auth popup was blocked");
      }

      const accessToken = await messageTokenPromise;

      if (!accessToken) {
        throw new Error("Yandex token was not returned");
      }

      await completeYandexAuth(accessToken);
    } catch (authError) {
      console.error(authError);
      setError("Не удалось завершить авторизацию Яндекса.");
    } finally {
      setIsAuthorizing(false);
    }
  };

  const signOut = () => {
    clearAuthSession();
    clearVkAuthChallenge();
    setSession(null);
    setError("");
  };

  return {
    error,
    isAuthenticated: Boolean(session),
    isAuthorizing,
    isLoading,
    session,
    actions: {
      signInWithVk,
      signInWithYandex,
      signOut,
    },
  };
};
