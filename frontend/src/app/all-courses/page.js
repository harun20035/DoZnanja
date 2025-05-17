"use client"

import Link from "next/link"
import CourseCard from "./CourseCard"
import CategoryFilter from "./CategoryFilter"
import SearchAndSort from "./SearchAndSort"
import Pagination from "./Pagination"
import NoResults from "./NoResults"
import { categories, sortOptions } from "./CourseData"
import useCourses from "./useCourses"
import "./all-courses.css"

export default function AllCoursesPage() {
  const {
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
  } = useCourses()

  return (
    <div className="container-fluid p-4">

      <h2 className="mb-4">Svi kursevi</h2>

      {/* Pretraga i filtriranje */}
      <SearchAndSort
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOptions={sortOptions}
      />

      {/* Kategorije */}
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Rezultati pretrage */}
      {filteredCourses.length === 0 ? (
        <NoResults />
      ) : (
        <>
          <div className="row g-4">
            {currentCourses.map((course) => (
              <div key={course.id} className="col-sm-6 col-md-4 col-lg-3">
                <CourseCard course={course} />
              </div>
            ))}
          </div>

          {/* Paginacija */}
          <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
        </>
      )}
    </div>
  )
}
