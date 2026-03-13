const CameraHoverAction = ({ icon, label, onClick }) => {
  return (
    <button className="camera-hover-action" onClick={onClick} type="button">
      <span className="camera-hover-icon">{icon}</span>
      <span>{label}</span>
    </button>
  );
};

export const LocalStage = ({
  cameraError,
  cameraReady,
  cameraStarting,
  onEnableCamera,
  onToggleFullscreen,
  onToggleSettings,
  videoRef,
}) => {
  return (
    <section className="local-stage">
      {!cameraReady ? <div className="local-stage-noise" /> : null}
      <video
        autoPlay
        className={cameraReady ? "local-stage-video" : "local-stage-video hidden"}
        muted
        playsInline
        ref={videoRef}
      />
      <div className={`local-stage-overlay ${cameraReady ? "camera-active" : ""}`}>
        {!cameraReady ? (
          <div className="brand-lockup">
            <div className="brand-mark">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <h1>TalkRoulette</h1>
          </div>
        ) : null}

        {!cameraReady ? (
          <div className="stage-empty-state">
            <p className="stage-caption">
              {cameraError || "Камера выключена. Включите её кнопкой, когда будете готовы."}
            </p>
            <button
              className="camera-enable-button"
              disabled={cameraStarting}
              onClick={onEnableCamera}
              type="button"
            >
              {cameraStarting ? "Включаем камеру..." : "Включить камеру"}
            </button>
          </div>
        ) : null}
      </div>

      {cameraReady ? (
        <div className="camera-hover-actions">
          <CameraHoverAction
            icon="⛶"
            label="Во весь экран"
            onClick={onToggleFullscreen}
          />
          <CameraHoverAction
            icon="⚙"
            label="Настройки"
            onClick={onToggleSettings}
          />
        </div>
      ) : null}
    </section>
  );
};
