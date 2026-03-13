"use client";

export const AuthStatusBar = ({ session, onSignOut }) => {
  if (!session) {
    return null;
  }

  return (
    <div className="auth-status-bar">
      <div className="auth-profile">
        {session.avatar ? (
          <img
            alt={session.name}
            className="auth-avatar"
            height="44"
            src={session.avatar}
            width="44"
          />
        ) : (
          <div className="auth-avatar auth-avatar-fallback">
            {session.name.slice(0, 1).toUpperCase()}
          </div>
        )}

        <div className="auth-profile-copy">
          <strong>{session.name}</strong>
          <span>
            {session.provider === "vk" ? "VK ID" : "Яндекс ID"}
            {session.email ? ` · ${session.email}` : ""}
          </span>
        </div>
      </div>

      <button className="auth-signout" onClick={onSignOut} type="button">
        Выйти
      </button>
    </div>
  );
};
