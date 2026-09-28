export function PreventTicketPanel({ ticket }: { ticket: string }) {
  return (
    <div className="detail-panel prevent-panel">
      <span className="eyebrow">Prevent ticket</span>
      <h3>Internal root cause — not payer behavior</h3>
      <p className="detail-text">{ticket}</p>
    </div>
  )
}
