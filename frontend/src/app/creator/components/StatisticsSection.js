import "./dashboard.css"

export default function StatisticsSection() {
  return (
    <div className="course-stats">
      <div className="stats-header">
        <h2>📊 Statistika kurseva</h2>
        <select className="stats-select">
          <option>Zadnjih 7 dana</option>
          <option>Zadnjih 30 dana</option>
          <option>Zadnja 3 mjeseca</option>
          <option>Od početka</option>
        </select>
      </div>

      <div className="stats-grid">
        <div className="card stats-card">
          <div className="card-header">Ukupno studenata</div>
          <div className="card-content">
            <div className="stats-info">
              <div>
                <div className="stats-number">1,248</div>
                <div className="stats-change">+12% u odnosu na prošli mjesec</div>
              </div>
              <div className="stats-icon">👥</div>
            </div>
          </div>
        </div>

        <div className="card stats-card">
          <div className="card-header">Prihod</div>
          <div className="card-content">
            <div className="stats-info">
              <div>
                <div className="stats-number">$8,492</div>
                <div className="stats-change">+8% u odnosu na prošli mjesec</div>
              </div>
              <div className="stats-icon">💵</div>
            </div>
          </div>
        </div>

        <div className="card stats-card">
          <div className="card-header">Završeni kursevi</div>
          <div className="card-content">
            <div className="stats-info">
              <div>
                <div className="stats-number">432</div>
                <div className="stats-change">+5% u odnosu na prošli mjesec</div>
              </div>
              <div className="stats-icon">📘</div>
            </div>
          </div>
        </div>

        <div className="card stats-card">
          <div className="card-header">Prosječna ocjena</div>
          <div className="card-content">
            <div className="stats-info">
              <div>
                <div className="stats-number">4.8/5</div>
                <div className="stats-change">+0.2 u odnosu na prošli mjesec</div>
              </div>
              <div className="stats-icon">📈</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
