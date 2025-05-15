import "./dashboard.css"
import Link from "next/link"

export default function ProfileCard() {
  return (
    <div className="card profile-card">
      <div className="card-header purple-header">
        <h3 className="card-title">
          <span className="icon">👤</span>
          My Profile
        </h3>
      </div>
      <div className="card-content profile-content">
        <div className="avatar-container">
          <img src="/placeholder.svg?height=80&width=80" alt="Profile" className="avatar-img" />
          <div className="avatar-fallback">JD</div>
        </div>
        <h3 className="profile-name">John Doe</h3>
        <p className="profile-role">Web Development Instructor</p>

        <div className="progress-bar">
          <div className="progress-fill" style={{ width: "75%" }}></div>
        </div>
        <p className="progress-text">Profile completion: 75%</p>
      </div>
      <div className="card-footer">
        <Link href="/creator/profile" className="btn-outline-purple">
          ⚙ Edit Profile
        </Link>
      </div>
    </div>
  )
}
