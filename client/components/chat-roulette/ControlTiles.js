const ControlTile = ({ accent, icon, label, muted, onClick }) => {
  return (
    <button
      className={`control-tile ${accent ? `control-tile-${accent}` : ""} ${muted ? "is-muted" : ""}`}
      onClick={onClick}
      type="button"
    >
      <span>{label}</span>
      {icon ? <strong>{icon}</strong> : null}
    </button>
  );
};

export const ControlTiles = ({ onStart, onStop, partner }) => {
  return (
    <section className="control-grid">
      <ControlTile accent="blue" label={partner ? "Дальше" : "Старт"} onClick={onStart} />
      <ControlTile accent="rose" label="Стоп" onClick={onStop} />
      <ControlTile icon="🌍" label="Страна" muted onClick={() => {}} />
      <ControlTile icon="⚧" label="Ваш пол" muted onClick={() => {}} />
    </section>
  );
};
