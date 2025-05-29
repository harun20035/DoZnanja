"use client"
import { useEffect, useState } from "react"
import "./TokenAnimation.css"

export default function TokenAnimation({ tokenCount, isAnimating, isAddingTokens }) {
  const [particles, setParticles] = useState([])
  const [addParticles, setAddParticles] = useState([])

  useEffect(() => {
    if (isAnimating) {
      // Kreiraj partikle za trošenje
      const newParticles = Array.from({ length: 3 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: i * 0.1,
      }))
      setParticles(newParticles)

      setTimeout(() => {
        setParticles([])
      }, 1500)
    }
  }, [isAnimating])

  useEffect(() => {
    if (isAddingTokens) {
      // Kreiraj partikle za dodavanje tokena
      const newAddParticles = Array.from({ length: 8 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: i * 0.1,
      }))
      setAddParticles(newAddParticles)

      setTimeout(() => {
        setAddParticles([])
      }, 2000)
    }
  }, [isAddingTokens])

  return (
    <div className="token-animation-container">
      <div className={`token-icon ${isAnimating ? "consuming" : ""} ${isAddingTokens ? "adding" : ""}`}>
        <span className="token-letter">T</span>

        {/* Partikli za trošenje */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="token-particle consume"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}

        {/* Partikli za dodavanje */}
        {addParticles.map((particle) => (
          <div
            key={particle.id}
            className="token-particle add"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}

        {/* Pulsiranje kada se troši token */}
        {isAnimating && <div className="pulse-ring consume" />}

        {/* Pulsiranje kada se dodaju tokeni */}
        {isAddingTokens && <div className="pulse-ring add" />}
      </div>
    </div>
  )
}
