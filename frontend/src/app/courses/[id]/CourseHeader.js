import Link from "next/link"
import { formatDate } from "./utils"

export default function CourseHeader({ course }) {
  const formattedDate = formatDate(course.created_at)

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="bi bi-star-fill text-primary"></i>)
    }

    if (hasHalfStar) {
      stars.push(<i key="half" className="bi bi-star-half text-primary"></i>)
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="bi bi-star text-primary"></i>)
    }

    return stars
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-success"
      case "PENDING":
        return "bg-warning text-dark"
      case "REJECTED":
        return "bg-danger"
      case "REVIEW":
        return "bg-primary"
      default:
        return "bg-secondary"
    }
  }

  return (
    <div className="course-header py-4">
      <div className="container">
        <h1 className="course-title mb-4">{course.title}</h1>

        <div className="course-meta d-flex flex-wrap gap-4">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-calendar"></i>
            <span>Objavljeno: {formattedDate}</span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-tag"></i>
            <span>Kategorija: {course.category}</span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <div className="course-rating-stars">{renderStars(course.average_rating)}</div>
            <span>({course.average_rating.toFixed(1)})</span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-person-circle"></i>
            <span>Instruktor: {course.instructor_name || "Nepoznato"}</span>
          </div>
          {course.status && (
            <div className="d-flex align-items-center">
              <span className={`badge ${getStatusBadgeClass(course.status)}`}>{course.status}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
