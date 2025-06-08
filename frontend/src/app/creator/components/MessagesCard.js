import Link from "next/link"
import "./dashboard.css"

export default function MessagesCard() {
  const messages = [
    { id: 1, user: "Alex Kim", message: "Imam pitanje u vezi Modula 3...", time: "2h prije", avatar: "AK" },
    { id: 2, user: "Sarah Johnson", message: "Hvala na povratnim informacijama o mom projektu!", time: "5h prije", avatar: "SJ" },
  ]

  return (
    <div className="card chat-card">
      <div className="card-header">
        <h3>📩 Nedavne poruke</h3>
      </div>
      <div className="card-content">
        {messages.map((message) => (
          <div key={message.id} className="chat-message">
            <div className="avatar">{message.avatar}</div>
            <div className="chat-text">
              <div className="chat-meta">
                <span className="chat-user">{message.user}</span>
                <span className="chat-time">{message.time}</span>
              </div>
              <p className="chat-snippet">{message.message}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="card-footer">
        <Link href="/creator/chat" className="btn full-btn">💬 Pogledaj sve poruke</Link>
      </div>
    </div>
  )
}
