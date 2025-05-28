"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useRouter } from 'next/navigation';
import { getRoleFromToken, getUserDataFromToken } from '@/utils/auth';
import getHeaderByRole from "../../components/layoutComponents";
import Footer from "../../components/footer/Footer";
import Link from "next/link"
import CourseCard from "./CourseCard"
import StatusFilter from "./StatusFilter"
import SearchAndSort from "./SearchAndSort"
import Pagination from "./Pagination"
import NoResults from "./NoResults"
import { statuses, sortOptions } from "./CourseData"
import useCourses from "./useCourses"
import "./my-courses.css"

export default function MyCoursesPage() {
  const {
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
  } = useCourses()

  const [role, setRole] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuthorization = () => {
      try {
        const role = getRoleFromToken();
        setRole(role);
        const user = getUserDataFromToken();
        
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

        <h2 className="mb-4">Moji kursevi</h2>

        {/* Pretraga i filtriranje */}
        <SearchAndSort
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOptions={sortOptions}
        />

        {/* Statusi */}
        <StatusFilter statuses={statuses} selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus} />

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
      <Footer />
    </>
  )
}
