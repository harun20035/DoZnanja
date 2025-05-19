"use client"

import { useState, useEffect } from "react"
import { userCourses } from "./CourseData"

export default function useCourses() {
  const [courses, setCourses] = useState([])
  const [filteredCourses, setFilteredCourses] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("Svi")
  const [sortBy, setSortBy] = useState("last-accessed")
  const coursesPerPage = 8

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

  return {
    currentCourses,
    totalPages,
    currentPage,
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
    sortBy,
    setSortBy,
    paginate,
    filteredCourses,
  }
}
