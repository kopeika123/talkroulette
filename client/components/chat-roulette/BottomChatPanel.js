export function BottomChatPanel({
  messageDraft,
  messages,
  onMessageChange,
  onSendMessage,
  partner,
}) {
  return (
    <section className="chat-dock">
      <div className="chat-notice">
        <div className="chat-notice-icon">✿</div>
        <p>
          Нажав «Старт», вы соглашаетесь соблюдать правила. Убедитесь, что лицо
          хорошо видно собеседнику.
        </p>
      </div>

      <div className="chat-log chat-log-dock">
        {messages.length === 0 ? (
          <div className="chat-empty-state">
            <p>{partner ? `Вы подключены к ${partner.name}.` : "Сообщений пока нет."}</p>
          </div>
        ) : (
          messages.map((entry) => (
            <div
              className={`message-bubble ${entry.author === "you" ? "own" : ""}`}
              key={entry.id}
            >
              <span>{entry.author === "you" ? "Вы" : partner?.name || "Собеседник"}</span>
              <p>{entry.text}</p>
            </div>
          ))
        )}
      </div>

      <form className="chat-input-row" onSubmit={onSendMessage}>
        <input
          disabled={!partner}
          onChange={(event) => onMessageChange(event.target.value)}
          placeholder="Введите сюда текст сообщения и нажмите Enter"
          value={messageDraft}
        />
        <button className="chat-send" disabled={!partner || !messageDraft.trim()} type="submit">
          ↩
        </button>
      </form>
    </section>
  );
}
