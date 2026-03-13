"use client";

import { useEffect, useState } from "react";

const YANDEX_MESSAGE_SOURCE = "talkroulette-yandex-auth";

const extractAccessTokenFromUrl = () => {
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const searchParams = new URLSearchParams(window.location.search);

  return (
    hashParams.get("access_token") ||
    searchParams.get("access_token") ||
    ""
  );
};

const YandexTokenPage = () => {
  const [message, setMessage] = useState(
    "Передаем токен обратно в приложение...",
  );

  useEffect(() => {
    const accessToken = extractAccessTokenFromUrl();

    if (!accessToken) {
      setMessage("Токен Яндекса не найден в callback URL.");
      return;
    }

    if (window.opener) {
      window.opener.postMessage(
        {
          source: YANDEX_MESSAGE_SOURCE,
          access_token: accessToken,
        },
        window.location.origin,
      );
      setMessage("Токен отправлен. Это окно можно закрыть.");
      window.close();
      return;
    }

    setMessage("Не удалось связаться с основным окном приложения.");
  }, []);

  return (
    <main className="auth-dialog-backdrop">
      <section className="auth-card auth-card-compact">
        <h1>Яндекс ID</h1>
        <p className="auth-copy">{message}</p>
      </section>
    </main>
  );
};

export default YandexTokenPage;
