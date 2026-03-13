"use client";

import { useRef, useState } from "react";
import { useChatRouletteSession } from "../../hooks/useChatRouletteSession";
import { BottomChatPanel } from "./BottomChatPanel";
import { ControlTiles } from "./ControlTiles";
import { LocalStage } from "./LocalStage";
import { RemoteStage } from "./RemoteStage";
import { SettingsOverlay } from "./SettingsOverlay";

export const ChatRouletteShell = () => {
  const session = useChatRouletteSession();
  const remoteStageRef = useRef(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const toggleSettings = () => {
    setIsSettingsOpen((current) => !current);
  };

  const toggleFullscreen = async () => {
    if (!remoteStageRef.current) {
      return;
    }

    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }

    await remoteStageRef.current.requestFullscreen();
  };

  return (
    <>
      <main className="roulette-shell">
        <section className="roulette-layout">
          <div className="stage-split">
            <LocalStage
              cameraError={session.camera.error}
              cameraReady={session.camera.isReady}
              cameraStarting={session.camera.isStarting}
              onEnableCamera={session.camera.actions.startCamera}
              onToggleFullscreen={toggleFullscreen}
              onToggleSettings={toggleSettings}
              stageRef={remoteStageRef}
              videoRef={session.camera.videoRef}
            />
            <RemoteStage
              connectionError={session.connectionError}
              isSearching={session.isSearching}
              onlineCount={session.onlineCount}
              partner={session.partner}
              remoteStageRef={remoteStageRef}
              videoRef={session.remoteVideoRef}
            />
          </div>

          <div className="bottom-zone">
            <ControlTiles
              onStart={session.actions.startSearch}
              onStop={session.actions.stopSession}
              partner={session.partner}
            />
            <BottomChatPanel
              messageDraft={session.messageDraft}
              messages={session.messages}
              onMessageChange={session.actions.updateMessageDraft}
              onSendMessage={session.actions.sendMessage}
              partner={session.partner}
            />
          </div>
        </section>

        <SettingsOverlay
          interests={session.profileForm.interests}
          isOpen={isSettingsOpen}
          name={session.profileForm.name}
          onClose={toggleSettings}
          onInterestsChange={session.actions.updateInterests}
          onNameChange={session.actions.updateName}
        />
      </main>
    </>
  );
};
