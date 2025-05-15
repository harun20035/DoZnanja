"use client"

import Link from "next/link"
import Image from "next/image"

export default function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: "my-courses", label: "Moji kursevi", icon: "bi-book" },
    { id: "all-courses", label: "Svi kursevi", icon: "bi-collection" },
    { id: "chat", label: "Chat", icon: "bi-chat-dots" },
    { id: "profile", label: "Moj profil", icon: "bi-person" },
  ]

  return (
    <div className="sidebar py-4">
      <div className="d-flex justify-content-center mb-4">
        <Link href="/user-dashboard" className="text-decoration-none">
          <h3 className="navbar-brand mb-0">DoZnanja</h3>
        </Link>
      </div>
      <div className="px-3 mb-4">
        <div className="d-flex align-items-center p-3 bg-light-purple rounded">
          <div className="flex-shrink-0">
            <Image
              src="/placeholder.svg?height=40&width=40"
              width={40}
              height={40}
              className="avatar"
              alt="User avatar"
            />
          </div>
          <div className="flex-grow-1 ms-3">
            <p className="mb-0 fw-medium">Korisnik</p>
            <div className="d-flex align-items-center">
              <i className="bi bi-coin text-warning me-1"></i>
              <small>
                Krediti: <span className="fw-bold">120</span>
              </small>
            </div>
          </div>
        </div>
      </div>
      <nav className="nav flex-column px-3">
        {navItems.map((item) => (
          <a
            key={item.id}
            className={`nav-link d-flex align-items-center ${activeTab === item.id ? "active" : ""}`}
            href="#"
            onClick={(e) => {
              e.preventDefault()
              setActiveTab(item.id)
            }}
          >
            <i className={`bi ${item.icon} me-2`}></i>
            {item.label}
          </a>
        ))}
        <hr className="my-3" />
        <a className="nav-link d-flex align-items-center" href="#">
          <i className="bi bi-box-arrow-right me-2"></i>
          Odjava
        </a>
      </nav>
    </div>
  )
}
