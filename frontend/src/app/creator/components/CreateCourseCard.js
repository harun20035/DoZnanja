import Link from "next/link"
import "./dashboard.css"

export default function CreateCourseCard() {
  return (
    <div className="card create-course-card">
      <div className="card-header purple-header">
        <h3 className="card-title">
          <span className="icon">➕</span>
          Create New Course
        </h3>
      </div>
      <div className="card-content">
        <p className="card-text">
          Start building your next course and share your knowledge with students around the world.
        </p>
      </div>
      <div className="card-footer">
        <Link href="/creator/create" className="btn-purple">
          Create Course
        </Link>
      </div>
    </div>
  )
}
