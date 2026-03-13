"use client";

import { AuthScreen } from "../components/auth/AuthScreen";
import { AuthStatusBar } from "../components/auth/AuthStatusBar";
import { ChatRouletteShell } from "../components/chat-roulette/ChatRouletteShell";
import { useSocialAuth } from "../hooks/useSocialAuth";

const HomePage = () => {
  const auth = useSocialAuth();

  return (
    <>
      <AuthStatusBar onSignOut={auth.actions.signOut} session={auth.session} />
      <ChatRouletteShell />
      {!auth.isAuthenticated ? (
        <AuthScreen
          error={auth.error}
          isAuthorizing={auth.isAuthorizing}
          isLoading={auth.isLoading}
          onSignInWithVk={auth.actions.signInWithVk}
          onSignInWithYandex={auth.actions.signInWithYandex}
        />
      ) : null}
    </>
  );
};

export default HomePage;
