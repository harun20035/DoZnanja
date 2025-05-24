import Link from "next/link"
import { formatDate } from "./utils"

export default function CourseHeader({ course }) {
  // Format the created_at date
  const formattedDate = formatDate(course.created_at)

  // Function to render stars based on rating
  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="bi bi-star-fill"></i>)
    }

    if (hasHalfStar) {
      stars.push(<i key="half" className="bi bi-star-half"></i>)
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="bi bi-star"></i>)
    }

    return stars
  }

  // Function to get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-success"
      case "PENDING":
        return "bg-warning text-dark"
      case "REJECTED":
        return "bg-danger"
      default:
        return "bg-secondary"
    }
  }

  return (
    <div className="course-header">
      <div className="container">
        <nav aria-label="breadcrumb" className="course-breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link href="/">Početna</Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="/user/dashboard/all-courses">Kursevi</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {course.title}
            </li>
          </ol>
        </nav>

        <h1 className="course-title">{course.title}</h1>

        <div className="course-meta">
          <div className="course-meta-item">
            <i className="bi bi-calendar"></i>
            <span>Objavljeno: {formattedDate}</span>
          </div>
          <div className="course-meta-item">
            <i className="bi bi-tag"></i>
            <span>Kategorija: {course.category}</span>
          </div>
          <div className="course-meta-item">
            <div className="course-rating-stars me-2">{renderStars(course.average_rating)}</div>
            <span>({course.average_rating.toFixed(1)})</span>
          </div>
          <div className="course-meta-item">
            <i className="bi bi-person-circle"></i>
            <span>Instruktor: {course.instructor_name || "Nepoznato"}</span>
          </div>
          {course.status && (
            <div className="course-meta-item">
              <span className={`badge ${getStatusBadgeClass(course.status)}`}>{course.status}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
