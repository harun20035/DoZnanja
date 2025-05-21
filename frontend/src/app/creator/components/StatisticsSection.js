import "./dashboard.css"

export default function StatisticsSection() {
  return (
    <div className="course-stats">
      <div className="stats-header">
        <h2>📊 Course Statistics</h2>
        <select className="stats-select">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 3 months</option>
          <option>All time</option>
        </select>
      </div>

      <div className="stats-grid">
        <div className="card stats-card">
          <div className="card-header">Total Students</div>
          <div className="card-content">
            <div className="stats-info">
              <div>
                <div className="stats-number">1,248</div>
                <div className="stats-change">+12% from last month</div>
              </div>
              <div className="stats-icon">👥</div>
            </div>
          </div>
        </div>

        <div className="card stats-card">
          <div className="card-header">Revenue</div>
          <div className="card-content">
            <div className="stats-info">
              <div>
                <div className="stats-number">$8,492</div>
                <div className="stats-change">+8% from last month</div>
              </div>
              <div className="stats-icon">💵</div>
            </div>
          </div>
        </div>

        <div className="card stats-card">
          <div className="card-header">Course Completions</div>
          <div className="card-content">
            <div className="stats-info">
              <div>
                <div className="stats-number">432</div>
                <div className="stats-change">+5% from last month</div>
              </div>
              <div className="stats-icon">📘</div>
            </div>
          </div>
        </div>

        <div className="card stats-card">
          <div className="card-header">Average Rating</div>
          <div className="card-content">
            <div className="stats-info">
              <div>
                <div className="stats-number">4.8/5</div>
                <div className="stats-change">+0.2 from last month</div>
              </div>
              <div className="stats-icon">📈</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
