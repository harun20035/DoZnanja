"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import "../user/dashboard/dashboard.css"

export default function MyCoursesPage() {
  const [courses, setCourses] = useState([])
  const [filteredCourses, setFilteredCourses] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("Svi")
  const [sortBy, setSortBy] = useState("last-accessed")
  const coursesPerPage = 8

  // Statusi kurseva
  const statuses = ["Svi", "U toku", "Završeni", "Nije započeto"]

  // Opcije sortiranja
  const sortOptions = [
    { value: "last-accessed", label: "Zadnje pristupljeno" },
    { value: "progress-asc", label: "Napredak (rastuće)" },
    { value: "progress-desc", label: "Napredak (opadajuće)" },
    { value: "title-asc", label: "Naziv (A-Z)" },
    { value: "title-desc", label: "Naziv (Z-A)" },
  ]

  // Podaci o kursevima korisnika
  const userCourses = [
    {
      id: 1,
      title: "Web Programiranje",
      instructor: "Prof. Marko Marković",
      progress: 75,
      image: "/placeholder.svg?height=160&width=300",
      lastAccessed: "2023-05-12",
      lastAccessedFormatted: "12.05.2023.",
      status: "U toku",
      category: "Web Razvoj",
    },
    {
      id: 2,
      title: "Osnove JavaScript-a",
      instructor: "Dr. Ana Anić",
      progress: 45,
      image: "/placeholder.svg?height=160&width=300",
      lastAccessed: "2023-05-10",
      lastAccessedFormatted: "10.05.2023.",
      status: "U toku",
      category: "Web Razvoj",
    },
    {
      id: 3,
      title: "React za početnike",
      instructor: "Emir Emirović",
      progress: 90,
      image: "/placeholder.svg?height=160&width=300",
      lastAccessed: "2023-05-15",
      lastAccessedFormatted: "15.05.2023.",
      status: "U toku",
      category: "Web Razvoj",
    },
    {
      id: 4,
      title: "Baze podataka",
      instructor: "Prof. Selma Selimović",
      progress: 30,
      image: "/placeholder.svg?height=160&width=300",
      lastAccessed: "2023-05-08",
      lastAccessedFormatted: "08.05.2023.",
      status: "U toku",
      category: "Baze Podataka",
    },
    {
      id: 5,
      title: "Mobilni razvoj sa Flutter",
      instructor: "Adnan Adnanović",
      progress: 60,
      image: "/placeholder.svg?height=160&width=300",
      lastAccessed: "2023-05-14",
      lastAccessedFormatted: "14.05.2023.",
      status: "U toku",
      category: "Mobilni Razvoj",
    },
    {
      id: 6,
      title: "Python za Data Science",
      instructor: "Dr. Haris Hasić",
      progress: 15,
      image: "/placeholder.svg?height=160&width=300",
      lastAccessed: "2023-05-05",
      lastAccessedFormatted: "05.05.2023.",
      status: "U toku",
      category: "Data Science",
    },
    {
      id: 7,
      title: "UX/UI Dizajn",
      instructor: "Amina Aminović",
      progress: 5,
      image: "/placeholder.svg?height=160&width=300",
      lastAccessed: "2023-05-03",
      lastAccessedFormatted: "03.05.2023.",
      status: "Nije započeto",
      category: "Dizajn",
    },
    {
      id: 8,
      title: "HTML i CSS Osnove",
      instructor: "Prof. Marko Marković",
      progress: 100,
      image: "/placeholder.svg?height=160&width=300",
      lastAccessed: "2023-04-20",
      lastAccessedFormatted: "20.04.2023.",
      status: "Završeni",
      category: "Web Razvoj",
    },
    {
      id: 9,
      title: "Digitalni marketing",
      instructor: "Mirza Mirzić",
      progress: 100,
      image: "/placeholder.svg?height=160&width=300",
      lastAccessed: "2023-03-15",
      lastAccessedFormatted: "15.03.2023.",
      status: "Završeni",
      category: "Marketing",
    },
    {
      id: 10,
      title: "Poslovno Planiranje",
      instructor: "Jasmina Jasminović",
      progress: 0,
      image: "/placeholder.svg?height=160&width=300",
      lastAccessed: "2023-05-01",
      lastAccessedFormatted: "01.05.2023.",
      status: "Nije započeto",
      category: "Poslovanje",
    },
  ]

  // Učitaj kurseve pri prvom renderiranju
  useEffect(() => {
    setCourses(userCourses)
    setFilteredCourses(userCourses)
  }, [])

  // Filtriraj i sortiraj kurseve kada se promijene parametri
  useEffect(() => {
    let result = [...courses]

    // Filtriranje po statusu
    if (selectedStatus !== "Svi") {
      result = result.filter((course) => course.status === selectedStatus)
    }

    // Filtriranje po pretrazi
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase()
      result = result.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTermLower) ||
          course.instructor.toLowerCase().includes(searchTermLower) ||
          course.category.toLowerCase().includes(searchTermLower),
      )
    }

    // Sortiranje
    switch (sortBy) {
      case "last-accessed":
        result.sort((a, b) => new Date(b.lastAccessed) - new Date(a.lastAccessed))
        break
      case "progress-asc":
        result.sort((a, b) => a.progress - b.progress)
        break
      case "progress-desc":
        result.sort((a, b) => b.progress - a.progress)
        break
      case "title-asc":
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "title-desc":
        result.sort((a, b) => b.title.localeCompare(a.title))
        break
      default:
        break
    }

    setFilteredCourses(result)
    setCurrentPage(1) // Resetuj paginaciju kada se promijene filteri
  }, [courses, searchTerm, selectedStatus, sortBy])

  // Izračunaj trenutne kurseve za prikaz
  const indexOfLastCourse = currentPage * coursesPerPage
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse)
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage)

  // Funkcija za promjenu stranice
  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  // Funkcija za dobijanje boje progress bara na osnovu napretka
  const getProgressBarColor = (progress) => {
    if (progress === 100) return "bg-success"
    if (progress >= 70) return "bg-purple"
    if (progress >= 30) return ""
    return "bg-warning"
  }

  return (
    <div className="container-fluid p-4">
      <div className="mb-4">
        <Link href="/user/dashboard" className="btn btn-outline-purple">
          <i className="bi bi-arrow-left me-2"></i>
          Nazad na dashboard
        </Link>
      </div>

      <h2 className="mb-4">Moji kursevi</h2>

      {/* Pretraga i filtriranje */}
      <div className="row mb-4">
        <div className="col-md-6 mb-3 mb-md-0">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Pretraži moje kurseve..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-purple" type="button">
              <i className="bi bi-search"></i>
            </button>
          </div>
        </div>
        <div className="col-md-6">
          <div className="d-flex justify-content-md-end">
            <select
              className="form-select me-2"
              style={{ maxWidth: "200px" }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Statusi */}
      <div className="mb-4">
        <div className="d-flex flex-wrap gap-2">
          {statuses.map((status, index) => (
            <button
              key={index}
              className={`btn ${selectedStatus === status ? "btn-purple" : "btn-outline-purple"} me-2`}
              onClick={() => setSelectedStatus(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Rezultati pretrage */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-search display-1 text-muted"></i>
          <h3 className="mt-3">Nema rezultata za vašu pretragu</h3>
          <p className="text-muted">Pokušajte sa drugačijim ključnim riječima ili filterima</p>
        </div>
      ) : (
        <>
          <div className="row g-4">
            {currentCourses.map((course) => (
              <div key={course.id} className="col-sm-6 col-md-4 col-lg-3">
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
                      {course.progress === 0
                        ? "Započni kurs"
                        : course.progress === 100
                          ? "Pregledaj kurs"
                          : "Nastavi učenje"}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Paginacija */}
          {totalPages > 1 && (
            <nav className="mt-5">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                    Prethodna
                  </button>
                </li>
                {[...Array(totalPages)].map((_, index) => {
                  // Prikaži samo određeni broj stranica
                  if (
                    index === 0 ||
                    index === totalPages - 1 ||
                    (index >= currentPage - 2 && index <= currentPage + 2)
                  ) {
                    return (
                      <li key={index} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
                        <button
                          className={`page-link ${currentPage === index + 1 ? "bg-purple border-purple" : ""}`}
                          onClick={() => paginate(index + 1)}
                        >
                          {index + 1}
                        </button>
                      </li>
                    )
                  } else if (
                    (index === currentPage - 3 && currentPage > 3) ||
                    (index === currentPage + 3 && currentPage < totalPages - 3)
                  ) {
                    return (
                      <li key={index} className="page-item disabled">
                        <span className="page-link">...</span>
                      </li>
                    )
                  }
                  return null
                })}
                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Sljedeća
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  )
}
