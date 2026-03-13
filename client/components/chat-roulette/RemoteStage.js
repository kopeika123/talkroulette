const PartnerCard = ({ partner }) => {
  return (
    <div className="remote-partner-card">
      <div className="remote-avatar">{partner.name.slice(0, 1)}</div>
      <h2>{partner.name}</h2>
      <p>{partner.city}</p>
      <p>{partner.status}</p>
    </div>
  );
};

export const RemoteStage = ({
  connectionError,
  isSearching,
  onlineCount,
  partner,
  remoteStageRef,
  videoRef,
}) => {
  return (
    <section className="remote-stage" ref={remoteStageRef}>
      <video
        autoPlay
        className={partner ? "remote-stage-video" : "remote-stage-video hidden"}
        playsInline
        ref={videoRef}
      />

      <div className="remote-stage-screen">
        {isSearching ? (
          <div className="remote-stage-center">
            <div className="pulse-ring" />
            <p>Поиск собеседника в комнате LiveKit...</p>
          </div>
        ) : partner ? (
          <PartnerCard partner={partner} />
        ) : (
          <div className="remote-stage-center">
            <p>{connectionError || "Нажмите «Старт», чтобы подключиться к комнате."}</p>
          </div>
        )}
      </div>

      <div className="online-pill">{onlineCount.toLocaleString()} online</div>
    </section>
  );
};
