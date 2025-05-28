import Link from "next/link"
import "./dashboard.css"

export default function MessagesCard() {
  const messages = [
    { id: 1, user: "Alex Kim", message: "I have a question about Module 3...", time: "2h ago", avatar: "AK" },
    { id: 2, user: "Sarah Johnson", message: "Thanks for the feedback on my project!", time: "5h ago", avatar: "SJ" },
  ]

  return (
    <div className="card chat-card">
      <div className="card-header">
        <h3>📩 Recent Messages</h3>
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
        <Link href="/creator/chat" className="btn full-btn">💬 View All Messages</Link>
      </div>
    </div>
  )
}
