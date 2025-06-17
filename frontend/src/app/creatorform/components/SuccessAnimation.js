"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import "./SuccessAnimation.css"

export default function SuccessAnimation() {
  const [stage, setStage] = useState(0)
  const router = useRouter()

  useEffect(() => {
    // Odmah ukloni token i postavi flag za ponovnu prijavu
    localStorage.removeItem("auth_token")
    localStorage.setItem("requires_relogin", "true")

    const timer1 = setTimeout(() => setStage(1), 500)
    const timer2 = setTimeout(() => setStage(2), 1500)
    const timer3 = setTimeout(() => setStage(3), 2500)
    const timer4 = setTimeout(() => setStage(4), 3500)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
    }
  }, [])

  const handleLogout = () => {
    // Ukloni sve auth podatke
    localStorage.removeItem("auth_token")
    localStorage.removeItem("requires_relogin")

    // Preusmjeri na login stranicu
    router.push("/login")
  }

  return (
    <div className="success-animation-overlay">
      <div className="success-animation-container">
        {/* Confetti particles */}
        <div className="confetti">
          {[...Array(50)].map((_, i) => (
            <div key={i} className={`confetti-piece confetti-${i % 6}`}></div>
          ))}
        </div>

        {/* Main content */}
        <div className={`success-content ${stage >= 1 ? "show" : ""}`}>
          <div className="success-icon">
            <div className="crown-icon">
              <div className="crown-emoji">👑</div>
            </div>
          </div>

          <h1 className={`success-title ${stage >= 2 ? "show" : ""}`}>🎉 Čestitamo!</h1>

          <p className={`success-message ${stage >= 2 ? "show" : ""}`}>
            Uspješno ste postali <strong>kreator sadržaja</strong>!
          </p>

          <div className={`success-features ${stage >= 3 ? "show" : ""}`}>
            <div className="feature-item">
              <span className="feature-icon">📚</span>
              <span>Kreirajte kurseve</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">💰</span>
              <span>Zaradite tokene</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🌟</span>
              <span>Izgradite reputaciju</span>
            </div>
          </div>

          <div className={`logout-message ${stage >= 4 ? "show" : ""}`}>
            <h4>🔄 Potrebna je ponovna prijava</h4>
            <p>Da biste pristupili novim kreator funkcijama, molimo prijavite se ponovo s vašim ažuriranim nalogom.</p>
          </div>

          <div className={`success-actions ${stage >= 4 ? "show" : ""}`}>
            <button onClick={handleLogout} className="btn-logout">
              <i className="bi bi-box-arrow-right me-2"></i>
              Prijavite se ponovo
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
