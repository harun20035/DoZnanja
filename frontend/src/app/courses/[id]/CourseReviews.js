"use client"

import { useState } from "react"
import Image from "next/image"

export default function CourseReviews({ course }) {
  const [showAllReviews, setShowAllReviews] = useState(false)

  // Use reviews from course if available, otherwise use mock data
  const reviews = [
    {
      id: 1,
      user: "Ana Anić",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
      date: "15.05.2023.",
      content:
        "Odličan kurs! Naučila sam mnogo novih stvari i sada se osjećam spremno za rad na pravim projektima. Instruktor objašnjava sve detaljno i jasno.",
    },
    {
      id: 2,
      user: "Emir Emirović",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4,
      date: "10.05.2023.",
      content:
        "Vrlo koristan kurs sa mnogo praktičnih primjera. Jedina zamjerka je što bi neki dijelovi mogli biti detaljnije objašnjeni.",
    },
    {
      id: 3,
      user: "Selma Selimović",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
      date: "05.05.2023.",
      content:
        "Najbolji kurs koji sam pohađala! Instruktor je vrlo stručan i pristupačan. Materijali su odlični i primjeri su relevantni za stvarne situacije.",
    },
    {
      id: 4,
      user: "Haris Hasić",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4.5,
      date: "01.05.2023.",
      content: "Vrlo detaljan i informativan kurs. Preporučujem svima koji žele naučiti ovu tehnologiju.",
    },
    {
      id: 5,
      user: "Amina Aminović",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 3.5,
      date: "25.04.2023.",
      content: "Kurs je dobar, ali neki dijelovi su previše osnovni. Očekivala sam više naprednih tehnika.",
    },
  ]

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

  // Display only first 3 reviews unless showAllReviews is true
  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3)

  return (
    <div className="course-reviews">
      <div className="course-section">
        <h3 className="course-section-title">Recenzije studenata</h3>

        <div className="course-rating">
          <div className="course-rating-number">{course.average_rating.toFixed(1)}</div>
          <div>
            <div className="course-rating-stars">{renderStars(course.average_rating)}</div>
            <div className="course-rating-count">Bazirano na {reviews.length} recenzija</div>
          </div>
        </div>

        {displayedReviews.map((review) => (
          <div key={review.id} className="course-review-item">
            <div className="course-review-header">
              <div className="course-review-user">
                <div className="course-review-avatar">
                  <Image src={review.avatar || "/placeholder.svg"} alt={review.user} width={40} height={40} />
                </div>
                <div>
                  <div className="course-review-name">{review.user}</div>
                  <div className="course-review-date">{review.date}</div>
                </div>
              </div>
              <div className="course-review-rating">{renderStars(review.rating)}</div>
            </div>
            <div className="course-review-content">
              <p>{review.content}</p>
            </div>
          </div>
        ))}

        {reviews.length > 3 && (
          <div className="text-center mt-4">
            <button className="btn btn-outline-purple" onClick={() => setShowAllReviews(!showAllReviews)}>
              {showAllReviews ? (
                <>
                  <i className="bi bi-chevron-up me-2"></i>
                  Prikaži manje
                </>
              ) : (
                <>
                  <i className="bi bi-chevron-down me-2"></i>
                  Prikaži sve recenzije ({reviews.length})
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
