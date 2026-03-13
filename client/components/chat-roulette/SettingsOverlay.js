export function SettingsOverlay({
  interests,
  isOpen,
  name,
  onClose,
  onInterestsChange,
  onNameChange,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="settings-backdrop" onClick={onClose} role="presentation">
      <section className="settings-card" onClick={(event) => event.stopPropagation()}>
        <div className="settings-header">
          <div>
            <h2>Настройки</h2>
            <p>Меняем только внешний вид, логика чата остается прежней.</p>
          </div>
          <button className="settings-close" onClick={onClose} type="button">
            ×
          </button>
        </div>

        <label className="field">
          <span>Имя</span>
          <input
            onChange={(event) => onNameChange(event.target.value)}
            placeholder="Ваш ник"
            value={name}
          />
        </label>

        <label className="field">
          <span>Интересы</span>
          <textarea
            onChange={(event) => onInterestsChange(event.target.value)}
            rows={4}
            value={interests}
          />
        </label>
      </section>
    </div>
  );
}
