"use client"

import Link from "next/link"
import CoursesList from "./CoursesList"
import CategoryFilter from "./CategoryFilter"
import SearchAndSort from "./SearchAndSort"
import Pagination from "./Pagination"
import NoResults from "./NoResults"
import useCourses from "./useCourses"
import "./all-courses.css"

const categories = [
  "Programming", "Design", "Marketing", "Music", 
  "Business", "Photography", "Languages", "Other"
];

const sortOptions = [
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating-desc", label: "Highest Rated" },
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most Popular" }
];

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
    loading,
    error
  } = useCourses();

  return (
    <div className="container-fluid p-4">
      <h2 className="mb-4">Svi kursevi</h2>

      <SearchAndSort
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOptions={sortOptions}
      />

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {filteredCourses.length === 0 ? (
        <NoResults />
      ) : (
        <>
          <CoursesList 
            courses={currentCourses} 
            loading={loading} 
            error={error} 
          />
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            paginate={paginate} 
          />
        </>
      )}
    </div>
  )
}