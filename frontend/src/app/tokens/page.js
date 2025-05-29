"use client"
import { useState } from "react"
import TokenInfo from "./components/TokenInfo"
import TokenPurchase from "./components/TokenPurchase"
import "./tokens.css"

export default function TokensPage() {
  const [currentTokens, setCurrentTokens] = useState(125)
  const [isAddingTokens, setIsAddingTokens] = useState(false)

  const handleTokenPurchase = (tokenAmount) => {
    setIsAddingTokens(true)

    // Animacija dodavanja tokena
    setTimeout(() => {
      setCurrentTokens((prev) => prev + tokenAmount)
      setIsAddingTokens(false)
    }, 1500)
  }

  return (
    <div className="tokens-page">
      <div className="container-fluid">
        <div className="row min-vh-100">
          {/* Leva strana - Informacije o tokenima */}
          <div className="col-lg-6 col-md-12 info-section">
            <TokenInfo currentTokens={currentTokens} isAddingTokens={isAddingTokens} />
          </div>

          {/* Desna strana - Forma za kupovinu */}
          <div className="col-lg-6 col-md-12 purchase-section">
            <TokenPurchase onPurchase={handleTokenPurchase} />
          </div>
        </div>
      </div>
    </div>
  )
}
