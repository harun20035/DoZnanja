import Image from "next/image"

export default function CourseCard({ course }) {
  return (
    <div className="card course-card h-100">
      <Image
        src={course.image || "/placeholder.svg"}
        width={300}
        height={160}
        className="card-img-top"
        alt={course.title}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{course.title}</h5>
        <p className="card-text text-muted mb-1">{course.instructor}</p>
        <div className="d-flex align-items-center mt-2">
          <div className="me-2">
            {[...Array(5)].map((_, i) => (
              <i
                key={i}
                className={`bi ${
                  i < Math.floor(course.rating) ? "bi-star-fill" : i < course.rating ? "bi-star-half" : "bi-star"
                } text-warning`}
              ></i>
            ))}
          </div>
          <small className="text-muted">({course.reviews})</small>
        </div>
        <div className="mt-2">
          <span className="badge bg-light text-dark me-1">{course.category}</span>
          <span className="badge bg-light text-dark me-1">{course.level}</span>
          <span className="badge bg-light text-dark">{course.duration}</span>
        </div>
        <div className="mt-auto pt-3 d-flex justify-content-between align-items-center">
          <span className="fw-bold">{course.price} kredita</span>
          <a href="#" className="btn btn-outline-purple">
            Detalji
          </a>
        </div>
      </div>
    </div>
  )
}
