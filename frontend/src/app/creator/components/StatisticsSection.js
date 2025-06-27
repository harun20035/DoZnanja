"use client";
import "./dashboard.css";
import { useEffect, useState } from "react";

export default function StatisticsSection() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");

    if (!token) return;

    fetch("http://localhost:8000/course/statistika", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Greška pri dohvaćanju statistike");
        return res.json();
      })
      .then((data) => setStats(data))
      .catch((err) => console.error("Greška:", err));
  }, []);

  if (!stats) return <div className="course-stats">Učitavanje statistike...</div>;

  return (
    <div className="course-stats">
      <div className="stats-header">
        <h2>📊 Statistika kurseva</h2>
      </div>

      <div className="stats-grid">
        <div className="card stats-card">
          <div className="card-header">Ukupno kurseva</div>
          <div className="card-content">
            <div className="stats-info">
              <div>
                <div className="stats-number">{stats.total_courses}</div>
              </div>
              <div className="stats-icon">🎓</div>
            </div>
          </div>
        </div>

        <div className="card stats-card">
          <div className="card-header">Prihod</div>
          <div className="card-content">
            <div className="stats-info">
              <div>
                <div className="stats-number">{stats.total_revenue} Tokena</div>
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
                <div className="stats-number">{stats.completed_courses}</div>
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
                <div className="stats-number">{stats.average_rating}/5</div>
              </div>
              <div className="stats-icon">📈</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
