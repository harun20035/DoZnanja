import Link from "next/link"
import "./dashboard.css"

export default function CreateCourseCard() {
  return (
    <div className="card create-course-card">
      <div className="card-header purple-header">
        <h3 className="card-title">
          <span className="icon">➕</span>
          Kreiraj novi kurs
        </h3>
      </div>
      <div className="card-content">
        <p className="card-text">
          Započni izradu svog sljedećeg kursa i podijeli svoje znanje sa studentima širom svijeta.
        </p>
      </div>
      <div className="card-footer">
        <Link href="/creator/create" className="btn-purple">
          Kreiraj kurs
        </Link>
      </div>
    </div>
  )
}
