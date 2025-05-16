"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import "../user/dashboard/dashboard.css"

export default function AllCoursesPage() {
  const [courses, setCourses] = useState([])
  const [filteredCourses, setFilteredCourses] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Svi kursevi")
  const [sortBy, setSortBy] = useState("newest")
  const coursesPerPage = 8

  // Kategorije kurseva
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

  // Opcije sortiranja
  const sortOptions = [
    { value: "newest", label: "Najnovije" },
    { value: "oldest", label: "Najstarije" },
    { value: "price-asc", label: "Cijena (rastuće)" },
    { value: "price-desc", label: "Cijena (opadajuće)" },
    { value: "rating-asc", label: "Ocjena (rastuće)" },
    { value: "rating-desc", label: "Ocjena (opadajuće)" },
  ]

  // Podaci o kursevima
  const allCourses = [
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
      date: "2023-05-01",
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
      date: "2023-04-15",
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
      date: "2023-05-10",
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
      date: "2023-03-20",
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
      date: "2023-04-05",
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
      date: "2023-05-15",
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
      date: "2023-03-10",
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
      date: "2023-02-20",
    },
    {
      id: 9,
      title: "Node.js Backend Razvoj",
      instructor: "Haris Hasanović",
      rating: 4.7,
      reviews: 88,
      price: 65,
      image: "/placeholder.svg?height=160&width=300",
      category: "Web Razvoj",
      level: "Napredni",
      duration: "10 sedmica",
      date: "2023-05-05",
    },
    {
      id: 10,
      title: "SQL Napredne Tehnike",
      instructor: "Prof. Selma Selimović",
      rating: 4.6,
      reviews: 75,
      price: 55,
      image: "/placeholder.svg?height=160&width=300",
      category: "Baze Podataka",
      level: "Napredni",
      duration: "8 sedmica",
      date: "2023-04-10",
    },
    {
      id: 11,
      title: "iOS Razvoj sa Swift",
      instructor: "Adnan Adnanović",
      rating: 4.8,
      reviews: 92,
      price: 75,
      image: "/placeholder.svg?height=160&width=300",
      category: "Mobilni Razvoj",
      level: "Srednji",
      duration: "14 sedmica",
      date: "2023-03-15",
    },
    {
      id: 12,
      title: "Machine Learning Osnove",
      instructor: "Dr. Haris Hasić",
      rating: 4.9,
      reviews: 145,
      price: 80,
      image: "/placeholder.svg?height=160&width=300",
      category: "Data Science",
      level: "Srednji",
      duration: "12 sedmica",
      date: "2023-05-20",
    },
    {
      id: 13,
      title: "Adobe Photoshop za Početnike",
      instructor: "Amina Aminović",
      rating: 4.5,
      reviews: 105,
      price: 40,
      image: "/placeholder.svg?height=160&width=300",
      category: "Dizajn",
      level: "Početni",
      duration: "6 sedmica",
      date: "2023-02-15",
    },
    {
      id: 14,
      title: "SEO Optimizacija",
      instructor: "Mirza Mirzić",
      rating: 4.6,
      reviews: 88,
      price: 45,
      image: "/placeholder.svg?height=160&width=300",
      category: "Marketing",
      level: "Srednji",
      duration: "4 sedmice",
      date: "2023-04-25",
    },
    {
      id: 15,
      title: "Poslovno Planiranje",
      instructor: "Jasmina Jasminović",
      rating: 4.7,
      reviews: 65,
      price: 50,
      image: "/placeholder.svg?height=160&width=300",
      category: "Poslovanje",
      level: "Početni",
      duration: "6 sedmica",
      date: "2023-03-05",
    },
    {
      id: 16,
      title: "Finansijski Menadžment",
      instructor: "Jasmina Jasminović",
      rating: 4.8,
      reviews: 72,
      price: 60,
      image: "/placeholder.svg?height=160&width=300",
      category: "Poslovanje",
      level: "Srednji",
      duration: "8 sedmica",
      date: "2023-04-20",
    },
  ]

  // Učitaj kurseve pri prvom renderiranju
  useEffect(() => {
    setCourses(allCourses)
    setFilteredCourses(allCourses)
  }, [])

  // Filtriraj i sortiraj kurseve kada se promijene parametri
  useEffect(() => {
    let result = [...courses]

    // Filtriranje po kategoriji
    if (selectedCategory !== "Svi kursevi") {
      result = result.filter((course) => course.category === selectedCategory)
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
      case "newest":
        result.sort((a, b) => new Date(b.date) - new Date(a.date))
        break
      case "oldest":
        result.sort((a, b) => new Date(a.date) - new Date(b.date))
        break
      case "price-asc":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        result.sort((a, b) => b.price - a.price)
        break
      case "rating-asc":
        result.sort((a, b) => a.rating - b.rating)
        break
      case "rating-desc":
        result.sort((a, b) => b.rating - a.rating)
        break
      default:
        break
    }

    setFilteredCourses(result)
    setCurrentPage(1) // Resetuj paginaciju kada se promijene filteri
  }, [courses, searchTerm, selectedCategory, sortBy])

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

  return (
    <div className="container-fluid p-4">

      <h2 className="mb-4">Svi kursevi</h2>

      {/* Pretraga i filtriranje */}
      <div className="row mb-4">
        <div className="col-md-6 mb-3 mb-md-0">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Pretraži kurseve..."
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

      {/* Kategorije */}
      <div className="mb-4 categories-scroll">
        <div className="d-flex flex-nowrap overflow-auto pb-2">
          {categories.map((category, index) => (
            <button
              key={index}
              className={`btn ${
                selectedCategory === category ? "btn-purple" : "btn-outline-purple"
              } me-2 flex-shrink-0`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
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
