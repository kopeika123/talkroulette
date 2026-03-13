"use client";

import { useEffect, useState } from "react";
import * as VKID from "@vkid/sdk";
import {
  clearVkAuthChallenge,
  getVkRedirectUrl,
  readVkAuthChallenge,
  saveAuthSession,
} from "../../../../lib/auth/socialAuthStorage";
import {
  buildUserName,
  persistSocialSession,
} from "../../../../lib/auth/socialAuthApi";

const getCallbackParams = () => {
  const searchParams = new URLSearchParams(window.location.search);

  return {
    code: searchParams.get("code") || "",
    deviceId: searchParams.get("device_id") || "",
    state: searchParams.get("state") || "",
  };
};

const VkCallbackPage = () => {
  const [message, setMessage] = useState("Завершаем авторизацию VK ID...");

  useEffect(() => {
    const completeVkAuth = async () => {
      const challenge = readVkAuthChallenge();
      const { code, deviceId, state } = getCallbackParams();
      const appId = process.env.NEXT_PUBLIC_VK_APP_ID;

      if (!appId) {
        setMessage("Не задан VK APP ID.");
        return;
      }

      if (!challenge) {
        setMessage("Данные авторизации VK не найдены.");
        return;
      }

      if (!code || !deviceId || !state) {
        setMessage("VK callback URL не содержит обязательные параметры.");
        return;
      }

      if (challenge.state !== state) {
        clearVkAuthChallenge();
        setMessage("Не совпадает состояние авторизации VK.");
        return;
      }

      try {
        VKID.Config.init({
          app: Number(appId),
          redirectUrl: getVkRedirectUrl(),
          responseMode: VKID.ConfigResponseMode.Callback,
          source: VKID.ConfigSource.LOWCODE,
          state,
          codeVerifier: challenge.codeVerifier,
          scope: "",
        });

        const token = await VKID.Auth.exchangeCode(
          code,
          deviceId,
          challenge.codeVerifier,
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

        saveAuthSession(nextSession);
        clearVkAuthChallenge();
        setMessage("Авторизация VK завершена. Возвращаем вас в приложение...");
        window.location.replace("/");
      } catch (error) {
        console.error(error);
        clearVkAuthChallenge();
        setMessage("Не удалось завершить авторизацию VK.");
      }
    };

    completeVkAuth();
  }, []);

  return (
    <main className="auth-dialog-backdrop">
      <section className="auth-card auth-card-compact">
        <h1>VK ID</h1>
        <p className="auth-copy">{message}</p>
      </section>
    </main>
  );
};

export default VkCallbackPage;
