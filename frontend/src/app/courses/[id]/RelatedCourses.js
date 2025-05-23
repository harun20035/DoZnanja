import Image from "next/image"
import Link from "next/link"

export default function RelatedCourses() {
  // Mock related courses data
  const relatedCourses = [
    {
      id: 2,
      title: "Osnove JavaScript-a",
      instructor: "Dr. Ana Anić",
      rating: 4.5,
      reviews: 120,
      price: 45,
      image: "/placeholder.svg?height=160&width=300",
    },
    {
      id: 3,
      title: "React za početnike",
      instructor: "Emir Emirović",
      rating: 4.9,
      reviews: 210,
      price: 70,
      image: "/placeholder.svg?height=160&width=300",
    },
    {
      id: 4,
      title: "Baze podataka",
      instructor: "Prof. Selma Selimović",
      rating: 4.6,
      reviews: 98,
      price: 55,
      image: "/placeholder.svg?height=160&width=300",
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

  return (
    <div className="course-related">
      <div className="container">
        <h3 className="course-related-title">Slični kursevi</h3>
        <div className="row">
          {relatedCourses.map((course) => (
            <div key={course.id} className="col-md-4 mb-4">
              <div className="course-card">
                <Image
                  src={course.image || "/placeholder.svg"}
                  alt={course.title}
                  width={300}
                  height={160}
                  className="course-card-img"
                />
                <div className="course-card-body">
                  <h5 className="course-card-title">{course.title}</h5>
                  <p className="course-card-instructor">
                    <i className="bi bi-person-circle text-purple me-1"></i>
                    {course.instructor}
                  </p>
                  <div className="course-card-rating">
                    <div className="me-2">{renderStars(course.rating)}</div>
                    <span className="course-card-rating-count">({course.reviews})</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <span className="course-card-price">{course.price} kredita</span>
                    <Link href={`/courses/${course.id}`} className="btn btn-sm btn-outline-purple">
                      Detalji
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
