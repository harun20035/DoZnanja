import Image from "next/image"

export default function MyCourses() {
  const courses = [
    {
      id: 1,
      title: "Web Programiranje",
      instructor: "Prof. Marko Marković",
      progress: 75,
      image: "/placeholder.svg?height=160&width=300",
      lastAccessed: "12.05.2023.",
    },
    {
      id: 2,
      title: "Osnove JavaScript-a",
      instructor: "Dr. Ana Anić",
      progress: 45,
      image: "/placeholder.svg?height=160&width=300",
      lastAccessed: "10.05.2023.",
    },
    {
      id: 3,
      title: "React za početnike",
      instructor: "Emir Emirović",
      progress: 90,
      image: "/placeholder.svg?height=160&width=300",
      lastAccessed: "15.05.2023.",
    },
    {
      id: 4,
      title: "Baze podataka",
      instructor: "Prof. Selma Selimović",
      progress: 30,
      image: "/placeholder.svg?height=160&width=300",
      lastAccessed: "08.05.2023.",
    },
  ]

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Moji kursevi</h2>
        <div className="d-flex">
          <div className="dropdown">
            <ul className="dropdown-menu" aria-labelledby="sortDropdown">
              <li>
                <a className="dropdown-item" href="#">
                  Najnovije
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Najstarije
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Napredak (rastući)
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Napredak (opadajući)
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {courses.map((course) => (
          <div key={course.id} className="col-md-6 col-lg-4 col-xl-3">
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
                <div className="mt-2 mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <small>Napredak</small>
                    <small>{course.progress}%</small>
                  </div>
                  <div className="progress" style={{ height: "8px" }}>
                    <div
                      className="progress-bar"
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
                    Zadnji pristup: {course.lastAccessed}
                  </small>
                </p>
                <a href="#" className="btn btn-purple w-100">
                  Nastavi učenje
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <h3 className="mb-4">Preporučeni kursevi za tebe</h3>
        <div className="row g-4">
          <div className="col-md-6 col-lg-4 col-xl-3">
            <div className="card course-card h-100">
              <Image
                src="/placeholder.svg?height=160&width=300"
                width={300}
                height={160}
                className="card-img-top"
                alt="Python za Data Science"
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">Python za Data Science</h5>
                <p className="card-text text-muted mb-1">Dr. Haris Hasić</p>
                <div className="d-flex align-items-center mt-2">
                  <div className="me-2">
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-half text-warning"></i>
                  </div>
                  <small className="text-muted">(128)</small>
                </div>
                <div className="mt-3 d-flex align-items-center">
                  <span className="badge bg-purple me-2">Preporučeno</span>
                  <span className="badge bg-light text-dark">Data Science</span>
                </div>
                <div className="mt-auto pt-3 d-flex justify-content-between align-items-center">
                  <span className="fw-bold">50 kredita</span>
                  <a href="#" className="btn btn-outline-purple">
                    Detalji
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-4 col-xl-3">
            <div className="card course-card h-100">
              <Image
                src="/placeholder.svg?height=160&width=300"
                width={300}
                height={160}
                className="card-img-top"
                alt="UX/UI Dizajn"
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">UX/UI Dizajn</h5>
                <p className="card-text text-muted mb-1">Amina Aminović</p>
                <div className="d-flex align-items-center mt-2">
                  <div className="me-2">
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star text-warning"></i>
                  </div>
                  <small className="text-muted">(95)</small>
                </div>
                <div className="mt-3 d-flex align-items-center">
                  <span className="badge bg-purple me-2">Preporučeno</span>
                  <span className="badge bg-light text-dark">Dizajn</span>
                </div>
                <div className="mt-auto pt-3 d-flex justify-content-between align-items-center">
                  <span className="fw-bold">45 kredita</span>
                  <a href="#" className="btn btn-outline-purple">
                    Detalji
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
