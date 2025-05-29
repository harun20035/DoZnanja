import "./PaymentInstructions.css"

export default function PaymentInstructions() {
  return (
    <div className="payment-instructions">
      <h4 className="h5 mb-4">
        <i className="fas fa-credit-card me-2"></i>
        Načini plaćanja
      </h4>

      <div className="payment-methods">
        <div className="payment-method">
          <div className="method-icon">
            <i className="fab fa-cc-visa"></i>
          </div>
          <span>Visa/MasterCard</span>
        </div>

        <div className="payment-method">
          <div className="method-icon">
            <i className="fab fa-paypal"></i>
          </div>
          <span>PayPal</span>
        </div>

        <div className="payment-method">
          <div className="method-icon">
            <i className="fas fa-university"></i>
          </div>
          <span>Bankovna transakcija</span>
        </div>
      </div>

      <div className="payment-steps">
        <h6 className="mb-3">Koraci za kupovinu:</h6>
        <ol className="steps-list">
          <li>Izaberite broj tokena</li>
          <li>Kliknite na "Uplati"</li>
          <li>Izaberite način plaćanja</li>
          <li>Potvrdite transakciju</li>
          <li>Tokeni će biti dodani na vaš račun</li>
        </ol>
      </div>

      <div className="security-note">
        <i className="fas fa-shield-alt me-2"></i>
        <small>Sve transakcije su sigurne i enkriptovane</small>
      </div>
    </div>
  )
}
