import "./CreatorCostNotice.css"

export default function CreatorCostNotice({ user, creatorCost }) {
  return (
    <div className="cost-notice mb-4">
      <div className="cost-icon">💳</div>
      <div className="cost-content">
        <h5>Trošak registracije</h5>
        <p>
          Postanak kreator košta <strong>{creatorCost} tokena</strong>. Ovaj trošak pokriva administrativne troškove i
          verifikaciju vašeg profila.
        </p>
        {user && (
          <p className="user-balance">
            Vaš trenutni balans: <strong>{user.coins} tokena</strong>
            {user.coins >= creatorCost ? (
              <span className="text-success ms-2">✓ Dovoljno sredstava</span>
            ) : (
              <span className="text-danger ms-2">✗ Nedovoljno sredstava</span>
            )}
          </p>
        )}
      </div>
    </div>
  )
}
