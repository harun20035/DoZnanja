import Image from "next/image"

export default function AllCourses() {
  const categories = [
    "Svi kursevi",
    "Web Razvoj",
    "Mobilni Razvoj",
    "Baze Podataka",
    "Data Science",
    "Dizajn",
    "Marketing",
    "Poslovanje",
  ]

  const courses = [
    {
      id: 1,
      title: "Web Programiranje",
      instructor: "Prof. Marko Marković",
      rating: 4.8,
      reviews: 156,
      price: 60,
      image: "/placeholder.svg?height=160&width=300",
      category: "Web Razvoj",
      level: "Početni",
      duration: "12 sedmica",
    },
    {
      id: 2,
      title: "Osnove JavaScript-a",
      instructor: "Dr. Ana Anić",
      rating: 4.5,
      reviews: 120,
      price: 45,
      image: "/placeholder.svg?height=160&width=300",
      category: "Web Razvoj",
      level: "Početni",
      duration: "8 sedmica",
    },
    {
      id: 3,
      title: "React za početnike",
      instructor: "Emir Emirović",
      rating: 4.9,
      reviews: 210,
      price: 70,
      image: "/placeholder.svg?height=160&width=300",
      category: "Web Razvoj",
      level: "Srednji",
      duration: "10 sedmica",
    },
    {
      id: 4,
      title: "Baze podataka",
      instructor: "Prof. Selma Selimović",
      rating: 4.6,
      reviews: 98,
      price: 55,
      image: "/placeholder.svg?height=160&width=300",
      category: "Baze Podataka",
      level: "Početni",
      duration: "8 sedmica",
    },
    {
      id: 5,
      title: "Flutter razvoj aplikacija",
      instructor: "Adnan Adnanović",
      rating: 4.7,
      reviews: 85,
      price: 65,
      image: "/placeholder.svg?height=160&width=300",
      category: "Mobilni Razvoj",
      level: "Srednji",
      duration: "12 sedmica",
    },
    {
      id: 6,
      title: "Python za Data Science",
      instructor: "Dr. Haris Hasić",
      rating: 4.8,
      reviews: 128,
      price: 50,
      image: "/placeholder.svg?height=160&width=300",
      category: "Data Science",
      level: "Početni",
      duration: "10 sedmica",
    },
    {
      id: 7,
      title: "UX/UI Dizajn",
      instructor: "Amina Aminović",
      rating: 4.4,
      reviews: 95,
      price: 45,
      image: "/placeholder.svg?height=160&width=300",
      category: "Dizajn",
      level: "Početni",
      duration: "8 sedmica",
    },
    {
      id: 8,
      title: "Digitalni marketing",
      instructor: "Mirza Mirzić",
      rating: 4.5,
      reviews: 110,
      price: 40,
      image: "/placeholder.svg?height=160&width=300",
      category: "Marketing",
      level: "Početni",
      duration: "6 sedmica",
    },
  ]

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Svi kursevi</h2>
        <div className="d-flex">
          <div className="input-group me-2">
            <input type="text" className="form-control" placeholder="Pretraži kurseve..." />
            <button className="btn btn-purple" type="button">
              <i className="bi bi-search"></i>
            </button>
          </div>
          <div className="dropdown">
            <button
              className="btn btn-outline-purple dropdown-toggle"
              type="button"
              id="filterDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Filtriraj
            </button>
            <ul className="dropdown-menu" aria-labelledby="filterDropdown">
              <li>
                <a className="dropdown-item" href="#">
                  Cijena (rastuće)
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Cijena (opadajuće)
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Ocjena (rastuće)
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Ocjena (opadajuće)
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Najnovije
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mb-4 categories-scroll">
        <div className="d-flex flex-nowrap overflow-auto pb-2">
          {categories.map((category, index) => (
            <button
              key={index}
              className={`btn ${index === 0 ? "btn-purple" : "btn-outline-purple"} me-2 flex-shrink-0`}
            >
              {category}
            </button>
          ))}
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
                <div className="d-flex align-items-center mt-2">
                  <div className="me-2">
                    {[...Array(5)].map((_, i) => (
                      <i
                        key={i}
                        className={`bi ${
                          i < Math.floor(course.rating)
                            ? "bi-star-fill"
                            : i < course.rating
                              ? "bi-star-half"
                              : "bi-star"
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
          </div>
        ))}
      </div>

      <nav className="mt-5">
        <ul className="pagination justify-content-center">
          <li className="page-item disabled">
            <a className="page-link" href="#" tabIndex="-1" aria-disabled="true">
              Prethodna
            </a>
          </li>
          <li className="page-item active">
            <a className="page-link bg-purple border-purple" href="#">
              1
            </a>
          </li>
          <li className="page-item">
            <a className="page-link" href="#">
              2
            </a>
          </li>
          <li className="page-item">
            <a className="page-link" href="#">
              3
            </a>
          </li>
          <li className="page-item">
            <a className="page-link" href="#">
              Sljedeća
            </a>
          </li>
        </ul>
      </nav>
    </div>
  )
}
