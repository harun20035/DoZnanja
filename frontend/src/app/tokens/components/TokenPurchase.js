"use client"
import { useState } from "react"
import "./TokenPurchase.css"

export default function TokenPurchase({ onPurchase }) {
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [customAmount, setCustomAmount] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const tokenPackages = [
    {
      id: 1,
      tokens: 50,
      price: 25,
      bonus: 0,
      popular: false,
      description: "Starter paket",
    },
    {
      id: 2,
      tokens: 100,
      price: 45,
      bonus: 5,
      popular: true,
      description: "Najpopularniji",
    },
    {
      id: 3,
      tokens: 200,
      price: 85,
      bonus: 15,
      popular: false,
      description: "Najbolja vrednost",
    },
    {
      id: 4,
      tokens: 500,
      price: 200,
      bonus: 50,
      popular: false,
      description: "Premium paket",
    },
    {
      id: 5,
      tokens: 1000,
      price: 380,
      bonus: 120,
      popular: false,
      description: "Mega paket",
    },
  ]

  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg)
    setCustomAmount("")
  }

  const handleCustomAmountChange = (e) => {
    const value = e.target.value
    if (value === "" || (Number.parseInt(value) >= 1 && Number.parseInt(value) <= 10000)) {
      setCustomAmount(value)
      setSelectedPackage(null)
    }
  }

  const getCustomPackage = () => {
    if (!customAmount) return null
    const tokens = Number.parseInt(customAmount)
    const pricePerToken = 0.5
    return {
      tokens,
      price: Math.round(tokens * pricePerToken),
      bonus: 0,
      description: "Prilagođeni paket",
    }
  }

  const getCurrentSelection = () => {
    return selectedPackage || getCustomPackage()
  }

  const handlePurchase = async () => {
    const currentSelection = getCurrentSelection()
    if (!currentSelection) return

    setIsProcessing(true)

    // Simulacija API poziva
    setTimeout(() => {
      const totalTokens = currentSelection.tokens + currentSelection.bonus
      onPurchase(totalTokens)
      setIsProcessing(false)
      setSelectedPackage(null)
      setCustomAmount("")
    }, 2000)
  }

  const currentSelection = getCurrentSelection()

  return (
    <div className="token-purchase-container">
      <div className="purchase-header">
        <h2 className="h3 fw-bold mb-3">Kupite tokene</h2>
        <p className="text-muted mb-4">Izaberite paket koji vam odgovara i nastavite sa učenjem</p>
      </div>

      <div className="packages-grid">
        {tokenPackages.map((pkg) => (
          <div
            key={pkg.id}
            className={`package-card ${selectedPackage?.id === pkg.id ? "selected" : ""} ${pkg.popular ? "popular" : ""}`}
            onClick={() => handlePackageSelect(pkg)}
          >
            {pkg.popular && (
              <div className="popular-badge">
                <i className="fas fa-star me-1"></i>
                Najpopularniji
              </div>
            )}

            <div className="package-content">
              <div className="token-amount">
                <span className="main-tokens">{pkg.tokens}</span>
                {pkg.bonus > 0 && <span className="bonus-tokens">+{pkg.bonus} bonus</span>}
                <span className="token-label">tokena</span>
              </div>

              <div className="package-price">
                <span className="price">${pkg.price}</span>
                <span className="price-per-token">${(pkg.price / (pkg.tokens + pkg.bonus)).toFixed(2)} po tokenu</span>
              </div>

              <div className="package-description">{pkg.description}</div>

              {pkg.bonus > 0 && (
                <div className="savings-badge">Ušteda ${(pkg.tokens * 0.5 - pkg.price).toFixed(0)}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="custom-purchase">
        <h5 className="mb-3">Ili kupite po želji</h5>
        <div className="custom-input-group">
          <input
            type="number"
            className="form-control custom-input"
            placeholder="Unesite broj tokena (1-10000)"
            value={customAmount}
            onChange={handleCustomAmountChange}
            min="1"
            max="10000"
          />
          {customAmount && <div className="custom-price">Cijena: ${getCustomPackage()?.price}</div>}
        </div>
      </div>

      {currentSelection && (
        <div className="purchase-summary">
          <h5 className="mb-3">Pregled kupovine</h5>
          <div className="summary-details">
            <div className="summary-row">
              <span>Osnovni tokeni:</span>
              <span>{currentSelection.tokens}</span>
            </div>
            {currentSelection.bonus > 0 && (
              <div className="summary-row bonus">
                <span>Bonus tokeni:</span>
                <span>+{currentSelection.bonus}</span>
              </div>
            )}
            <div className="summary-row total">
              <span>Ukupno tokena:</span>
              <span>{currentSelection.tokens + currentSelection.bonus}</span>
            </div>
            <div className="summary-row price">
              <span>Cijena:</span>
              <span>${currentSelection.price}</span>
            </div>
          </div>
        </div>
      )}

      <div className="purchase-actions">
        <button
          className={`btn btn-purchase ${!currentSelection ? "disabled" : ""}`}
          onClick={handlePurchase}
          disabled={!currentSelection || isProcessing}
        >
          {isProcessing ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              Obrađuje se...
            </>
          ) : (
            <>
              <i className="fas fa-credit-card me-2"></i>
              Uplati ${currentSelection?.price || 0}
            </>
          )}
        </button>

        {currentSelection && (
          <button
            className="btn btn-outline-secondary mt-2"
            onClick={() => {
              setSelectedPackage(null)
              setCustomAmount("")
            }}
          >
            Poništi izbor
          </button>
        )}
      </div>

      <div className="purchase-benefits">
        <h6 className="mb-3">Zašto kupiti tokene?</h6>
        <ul className="benefits-list">
          <li>
            <i className="fas fa-check-circle me-2"></i>
            Pristup premium kursevima
          </li>
          <li>
            <i className="fas fa-check-circle me-2"></i>
            Ekskluzivni materijali za učenje
          </li>
          <li>
            <i className="fas fa-check-circle me-2"></i>
            Sertifikati po završetku
          </li>
          <li>
            <i className="fas fa-check-circle me-2"></i>
            Direktna komunikacija sa instruktorima
          </li>
        </ul>
      </div>
    </div>
  )
}
