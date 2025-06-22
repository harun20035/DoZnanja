"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import "./dashboard.css"

export default function MessagesCard() {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("auth_token")
        const res = await fetch("http://localhost:8000/chat/messages/last", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (!res.ok) throw new Error("Greška pri dohvatanju poruka.")
        const data = await res.json()

        const transformed = data.map((msg) => ({
          id: msg.id,
          user: `${msg.name} ${msg.surname}`,
          avatar: msg.avatar
            ? `http://localhost:8000/${msg.avatar.replace(/\\/g, "/")}`
            : `${msg.name[0]}${msg.surname[0]}`.toUpperCase(),
          message: msg.message,
          time: new Date(msg.timestamp).toLocaleTimeString("sr-Latn-BA", {
            hour: "2-digit",
            minute: "2-digit"
          }),
        }))

        setMessages(transformed)
      } catch (err) {
        console.error("❌ Ne mogu dohvatiti poruke:", err)
      }
    }

    fetchMessages()
  }, [])

  return (
    <div className="card chat-card">
      <div className="card-header">
        <h3>📩 Nedavne poruke</h3>
      </div>

      <div className="card-content">
        {messages.length === 0 ? (
          <p className="no-messages">Nema poruka za prikaz.</p>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="chat-message">
              {message.avatar.startsWith("http") ? (
                <img src={message.avatar} alt="avatar" className="chat-avatar-img" />
              ) : (
                <div className="chat-avatar">{message.avatar}</div>
              )}

              <div className="chat-text">
                <div className="chat-meta">
                  <span className="chat-user">{message.user}</span>
                  <span className="chat-time">{message.time}</span>
                </div>
                <p className="chat-snippet">{message.message}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="card-footer">
        <Link href="/creator/chat" className="btn full-btn">💬 Pogledaj sve poruke</Link>
      </div>
    </div>
  )
}
