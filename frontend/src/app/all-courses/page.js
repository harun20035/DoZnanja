"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getRoleFromToken, getUserDataFromToken } from '@/utils/auth';
import getHeaderByRole from "../../components/layoutComponents";
import Footer from "../../components/footer/Footer";
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
  { value: "price-asc", label: "Cijena: Najniža do najviša" },
  { value: "price-desc", label: "Cijena: Najviša do najniža" },
  { value: "rating-desc", label: "Najveća ocjena" },
  { value: "newest", label: "Najnoviji" },
  { value: "popular", label: "Najpopularniji" }
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

  const router = useRouter();
  const [username, setUsername] = useState('');
  const [role, setRole] = useState(null);

  useEffect(() => {
    const checkAuthorization = () => {
      try {
        const role = getRoleFromToken();
        setRole(role);
        const user = getUserDataFromToken();
        setUsername(user?.username || '');
        
        // Ako korisnik ima bilo koju rolu, smatramo ga autoriziranim
        if (role) {
          // Dodatna logika ako je potrebno
        } else {
          router.push("/login"); // Preusmjeri na login ako nema role
        }
      } catch (error) {
        console.error("Authorization error:", error);
        router.push("/login");
      }
    };

    checkAuthorization();
  }, [router]);

  if (!role) {
    return <div>Loading...</div>; // Bolje od null za UX
  }

  return (
    <>
      {getHeaderByRole(role)}
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

        {loading ? (
          <div>Učitavanje kurseva...</div>
        ) : error ? (
          <div>Error: {error.message}</div>
        ) : filteredCourses.length === 0 ? (
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
      {<Footer />}
    </>
  )
}