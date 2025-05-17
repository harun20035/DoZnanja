"use client"

import { useState, useEffect } from "react"
import { allCourses } from "./CourseData"

export default function useCourses() {
  const [courses, setCourses] = useState([])
  const [filteredCourses, setFilteredCourses] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Svi kursevi")
  const [sortBy, setSortBy] = useState("newest")
  const coursesPerPage = 8

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

  return {
    currentCourses,
    totalPages,
    currentPage,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    paginate,
    filteredCourses,
  }
}
