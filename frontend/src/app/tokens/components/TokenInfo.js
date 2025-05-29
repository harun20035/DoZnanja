"use client"
import { useState, useEffect } from "react"
import TokenAnimation from "./TokenAnimation"
import PaymentInstructions from "./PaymentInstructions"
import "./TokenInfo.css"

export default function TokenInfo({ currentTokens, isAddingTokens }) {
  const [isAnimating, setIsAnimating] = useState(false)

  const simulateTokenUsage = () => {
    if (currentTokens > 0) {
      setIsAnimating(true)
      setTimeout(() => {
        setIsAnimating(false)
      }, 1000)
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        // 20% šanse da se pokaže animacija trošenja
        simulateTokenUsage()
      }
    }, 4000)

    return () => clearInterval(interval)
  }, [currentTokens])

  return (
    <div className="token-info-container">
      <div className="info-header">
        <h1 className="display-4 fw-bold text-primary mb-4">DoZnanja Tokeni</h1>
        <p className="lead text-muted">Vaša digitalna valuta za pristup kursevima</p>
      </div>

      <div className="current-balance-card">
        <div className="balance-header">
          <h3 className="h4 mb-3">Trenutno stanje</h3>
        </div>
        <div className="balance-display">
          <TokenAnimation tokenCount={currentTokens} isAnimating={isAnimating} isAddingTokens={isAddingTokens} />
          <span className="token-count">{currentTokens}</span>
        </div>
      </div>

      <div className="token-features">
        <h4 className="h5 mb-4">Kako funkcionišu tokeni?</h4>

        <div className="feature-item">
          <div className="feature-icon">
            <i className="fas fa-play-circle"></i>
          </div>
          <div className="feature-content">
            <h6>Pristup kursevima</h6>
            <p>Plati pristup kursu tokenima. Jednostavno i transparentno.</p>
          </div>
        </div>

        <div className="feature-item">
          <div className="feature-icon">
            <i className="fas fa-infinity"></i>
          </div>
          <div className="feature-content">
            <h6>Bez isteka</h6>
            <p>Vaši tokeni nikad ne isteknu. Koristite ih kada želite.</p>
          </div>
        </div>

        <div className="feature-item">
          <div className="feature-icon">
            <i className="fas fa-gift"></i>
          </div>
          <div className="feature-content">
            <h6>Bonus tokeni</h6>
            <p>Veće kupovine donose bonus tokene i popuste.</p>
          </div>
        </div>

        <div className="feature-item">
          <div className="feature-icon">
            <i className="fas fa-certificate"></i>
          </div>
          <div className="feature-content">
            <h6>Premium sadržaj</h6>
            <p>Pristup ekskluzivnim kursevima i materijalima.</p>
          </div>
        </div>
      </div>

      <PaymentInstructions />
    </div>
  )
}
