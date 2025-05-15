"use client"

import { useState } from "react"
import Image from "next/image"

export default function Navbar({ setActiveTab }) {
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const navItems = [
    { id: "my-courses", label: "Moji kursevi", icon: "bi-book" },
    { id: "all-courses", label: "Svi kursevi", icon: "bi-collection" },
    { id: "chat", label: "Chat", icon: "bi-chat-dots" },
    { id: "profile", label: "Moj profil", icon: "bi-person" },
  ]

  return (
    <nav className="navbar navbar-expand-md navbar-light bg-white border-bottom">
      <div className="container-fluid">
        <a className="navbar-brand d-md-none" href="#">
          DoZnanja
        </a>
        <button className="navbar-toggler" type="button" onClick={() => setShowMobileMenu(!showMobileMenu)}>
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${showMobileMenu ? "show" : ""}`}>
          <ul className="navbar-nav d-md-none">
            {navItems.map((item) => (
              <li key={item.id} className="nav-item">
                <a
                  className="nav-link d-flex align-items-center"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setActiveTab(item.id)
                    setShowMobileMenu(false)
                  }}
                >
                  <i className={`bi ${item.icon} me-2`}></i>
                  {item.label}
                </a>
              </li>
            ))}
            <li className="nav-item">
              <a className="nav-link d-flex align-items-center" href="#">
                <i className="bi bi-box-arrow-right me-2"></i>
                Odjava
              </a>
            </li>
          </ul>
        </div>
        <div className="d-none d-md-flex align-items-center ms-auto">
          <div className="me-3">
            <span className="credits-badge">
              <i className="bi bi-coin me-1"></i>
              120 kredita
            </span>
          </div>
          <div className="dropdown">
            <a
              href="#"
              className="d-flex align-items-center text-decoration-none dropdown-toggle"
              id="userDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <Image
                src="/placeholder.svg?height=40&width=40"
                width={40}
                height={40}
                className="avatar"
                alt="User avatar"
              />
            </a>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
              <li>
                <a
                  className="dropdown-item"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setActiveTab("profile")
                  }}
                >
                  <i className="bi bi-person me-2"></i>
                  Moj profil
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  <i className="bi bi-gear me-2"></i>Postavke
                </a>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  <i className="bi bi-box-arrow-right me-2"></i>Odjava
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  )
}
