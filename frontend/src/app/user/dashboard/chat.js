"use client"

import { useState } from "react"
import Image from "next/image"

export default function Chat() {
  const [activeChat, setActiveChat] = useState(1)
  const [message, setMessage] = useState("")

  const contacts = [
    {
      id: 1,
      name: "Prof. Marko Marković",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Hvala na pitanju, uskoro ću odgovoriti.",
      time: "10:30",
      unread: 0,
      status: "online",
      course: "Web Programiranje",
    },
    {
      id: 2,
      name: "Dr. Ana Anić",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Možete li mi poslati vaš zadatak?",
      time: "Jučer",
      unread: 2,
      status: "offline",
      course: "Osnove JavaScript-a",
    },
    {
      id: 3,
      name: "Emir Emirović",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Odlično urađeno!",
      time: "Jučer",
      unread: 0,
      status: "online",
      course: "React za početnike",
    },
    {
      id: 4,
      name: "Grupa: Baze podataka",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Selma: Kada je rok za predaju projekta?",
      time: "23.05.",
      unread: 5,
      status: "group",
      course: "Baze podataka",
    },
  ]

  const messages = [
    {
      id: 1,
      senderId: 1,
      text: "Pozdrav! Kako vam mogu pomoći oko kursa Web Programiranja?",
      time: "10:15",
      date: "Danas",
    },
    {
      id: 2,
      senderId: "me",
      text: "Pozdrav profesore! Imam pitanje vezano za zadatak iz HTML-a i CSS-a.",
      time: "10:20",
      date: "Danas",
    },
    {
      id: 3,
      senderId: 1,
      text: "Naravno, recite o čemu se radi?",
      time: "10:22",
      date: "Danas",
    },
    {
      id: 4,
      senderId: "me",
      text: "Nisam siguran kako da implementiram responzivni dizajn za mobilne uređaje. Možete li mi dati neki savjet?",
      time: "10:25",
      date: "Danas",
    },
    {
      id: 5,
      senderId: 1,
      text: "Hvala na pitanju, uskoro ću odgovoriti.",
      time: "10:30",
      date: "Danas",
    },
  ]

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (message.trim() === "") return

    // Here you would normally send the message to your backend
    console.log("Sending message:", message)

    // Clear the input field
    setMessage("")
  }

  return (
    <div className="row">
      <div className="col-md-4 col-lg-3">
        <div className="card">
          <div className="card-header bg-white">
            <h5 className="mb-0">Razgovori</h5>
          </div>
          <div className="card-body p-0">
            <div className="list-group list-group-flush">
              {contacts.map((contact) => (
                <a
                  key={contact.id}
                  href="#"
                  className={`list-group-item list-group-item-action d-flex gap-3 py-3 ${activeChat === contact.id ? "active bg-light-purple" : ""}`}
                  onClick={(e) => {
                    e.preventDefault()
                    setActiveChat(contact.id)
                  }}
                >
                  <div className="position-relative">
                    <Image
                      src={contact.avatar || "/placeholder.svg"}
                      width={40}
                      height={40}
                      className="avatar"
                      alt={contact.name}
                    />
                    {contact.status === "online" && (
                      <span
                        className="position-absolute bottom-0 end-0 bg-success rounded-circle"
                        style={{ width: "10px", height: "10px", border: "2px solid white" }}
                      ></span>
                    )}
                    {contact.status === "group" && (
                      <span
                        className="position-absolute bottom-0 end-0 bg-info rounded-circle"
                        style={{ width: "10px", height: "10px", border: "2px solid white" }}
                      ></span>
                    )}
                  </div>
                  <div className="d-flex w-100 justify-content-between align-items-start">
                    <div>
                      <h6 className="mb-0">{contact.name}</h6>
                      <p className="mb-0 small text-truncate" style={{ maxWidth: "100%" }}>
                        {contact.lastMessage}
                      </p>
                      <small className="text-muted">{contact.course}</small>
                    </div>
                    <div className="text-end">
                      <small className="text-muted d-block">{contact.time}</small>
                      {contact.unread > 0 && <span className="badge rounded-pill bg-purple">{contact.unread}</span>}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-8 col-lg-9">
        <div className="card">
          <div className="card-header bg-white">
            <div className="d-flex align-items-center w-100">
              <div className="position-relative me-2">
                <Image
                  src={contacts.find((c) => c.id === activeChat)?.avatar || "/placeholder.svg?height=40&width=40"}
                  width={40}
                  height={40}
                  className="avatar"
                  alt="Contact"
                />
                {contacts.find((c) => c.id === activeChat)?.status === "online" && (
                  <span
                    className="position-absolute bottom-0 end-0 bg-success rounded-circle"
                    style={{ width: "10px", height: "10px", border: "2px solid white" }}
                  ></span>
                )}
              </div>
              <div>
                <h5 className="mb-0">{contacts.find((c) => c.id === activeChat)?.name}</h5>
                <small className="text-muted">{contacts.find((c) => c.id === activeChat)?.course}</small>
              </div>
            </div>
          </div>
          <div className="card-body p-0">
            <div className="chat-container p-3" style={{ maxHeight: "400px", overflowY: "auto" }}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`chat-message ${message.senderId === "me" ? "sent" : "received"}`}
                  style={{ wordBreak: "break-word" }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="fw-medium">
                      {message.senderId === "me"
                        ? "Vi"
                        : contacts.find((c) => c.id === message.senderId)?.name || "Korisnik"}
                    </span>
                    <small className="text-muted">{message.time}</small>
                  </div>
                  <p className="mb-0">{message.text}</p>
                </div>
              ))}
            </div>
            <div className="p-3 border-top">
              <form onSubmit={handleSendMessage}>
                <div className="input-group">
                  <button type="button" className="btn btn-outline-secondary">
                    <i className="bi bi-paperclip"></i>
                  </button>
                  <input
                    type="text"
                    className="form-control chat-input"
                    placeholder="Napišite poruku..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <button type="submit" className="btn btn-purple">
                    <i className="bi bi-send"></i>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
