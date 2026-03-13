"use client";

export const AuthScreen = ({
  error,
  isAuthorizing,
  isLoading,
  onSignInWithVk,
  onSignInWithYandex,
}) => {
  return (
    <div className="auth-dialog-backdrop">
      <section
        aria-busy={isAuthorizing || isLoading}
        aria-modal="true"
        className="auth-card auth-dialog"
        role="dialog"
      >
        <p className="auth-eyebrow">TalkRoulette</p>
        <h2>Войдите, чтобы начать поиск собеседника</h2>
        <p className="auth-copy">
          Авторизация открывается поверх рулетки. После входа можно сразу включить
          камеру и начать поиск.
        </p>

        <div className="auth-actions">
          <button
            className="auth-provider auth-provider-vk"
            disabled={isAuthorizing || isLoading}
            onClick={onSignInWithVk}
            type="button"
          >
            <span className="auth-provider-badge">VK</span>
            <span>Продолжить через VK ID</span>
          </button>

          <button
            className="auth-provider auth-provider-yandex"
            disabled={isAuthorizing || isLoading}
            onClick={onSignInWithYandex}
            type="button"
          >
            <span className="auth-provider-badge">Я</span>
            <span>Продолжить через Яндекс ID</span>
          </button>
        </div>

        {error ? <p className="auth-error">{error}</p> : null}
        {isLoading ? <p className="auth-note">Проверяем сохраненную сессию...</p> : null}

      </section>
    </div>
  );
};
