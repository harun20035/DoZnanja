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

        
         
        </div>
      </div>
    
  )
}
