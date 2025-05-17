import Image from "next/image"

export default function CourseCard({ course }) {
  // Funkcija za dobijanje boje progress bara na osnovu napretka
  const getProgressBarColor = (progress) => {
    if (progress === 100) return "bg-success"
    if (progress >= 70) return "bg-purple"
    if (progress >= 30) return ""
    return "bg-warning"
  }

  return (
    <div className="card course-card h-100">
      <div className="position-relative">
        <Image
          src={course.image || "/placeholder.svg"}
          width={300}
          height={160}
          className="card-img-top"
          alt={course.title}
        />
        {course.status === "Završeni" && (
          <div className="position-absolute top-0 end-0 m-2">
            <span className="badge bg-success">
              <i className="bi bi-check-circle me-1"></i>
              Završeno
            </span>
          </div>
        )}
      </div>
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{course.title}</h5>
        <p className="card-text text-muted mb-1">{course.instructor}</p>
        <div className="mt-2 mb-3">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <small>Napredak</small>
            <small>{course.progress}%</small>
          </div>
          <div className="progress" style={{ height: "8px" }}>
            <div
              className={`progress-bar ${getProgressBarColor(course.progress)}`}
              role="progressbar"
              style={{ width: `${course.progress}%` }}
              aria-valuenow={course.progress}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
        </div>
        <p className="card-text mt-auto">
          <small className="text-muted">
            <i className="bi bi-clock me-1"></i>
            Zadnji pristup: {course.lastAccessedFormatted}
          </small>
        </p>
        <a href="#" className="btn btn-purple w-100">
          {course.progress === 0 ? "Započni kurs" : course.progress === 100 ? "Pregledaj kurs" : "Nastavi učenje"}
        </a>
      </div>
    </div>
  )
}
