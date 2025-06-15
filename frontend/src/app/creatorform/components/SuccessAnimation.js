"use client"

import { useEffect, useState } from "react"
import "./SuccessAnimation.css"

export default function SuccessAnimation({ onComplete }) {
  const [stage, setStage] = useState(0)

  useEffect(() => {
    const timer1 = setTimeout(() => setStage(1), 500)
    const timer2 = setTimeout(() => setStage(2), 1500)
    const timer3 = setTimeout(() => setStage(3), 2500)
    const timer4 = setTimeout(() => onComplete(), 4000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
    }
  }, [onComplete])

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
            <div className="checkmark">
              <div className="checkmark-circle"></div>
              <div className="checkmark-stem"></div>
              <div className="checkmark-kick"></div>
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

          <div className={`redirect-message ${stage >= 3 ? "show" : ""}`}>
            <div className="loading-dots">
              <span>Preusmjeravamo vas na creator dashboard</span>
              <div className="dots">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
