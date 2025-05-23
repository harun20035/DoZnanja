"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import CourseHeader from "./CourseHeader"
import CourseInfo from "./CourseInfo"
import RelatedCourses from "./RelatedCourses"
import "./page.css"

export default function CourseDetailPage() {
  const { id } = useParams()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        // Prvo pokušaj dohvatiti pojedinačni kurs
        let response = await fetch(`http://localhost:8000/user/courses/${id}`)

        // Ako taj endpoint ne postoji, dohvati sve kurseve i filtriraj
        if (!response.ok) {
          response = await fetch("http://localhost:8000/user/all-courses")
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

          const allCourses = await response.json()
          const foundCourse = allCourses.find((course) => course.id === Number.parseInt(id))

          if (!foundCourse) {
            throw new Error("Course not found")
          }

          // Transform image paths
          const transformedCourse = {
            ...foundCourse,
            image_thumbnail: foundCourse.image_thumbnail
              ? `http://localhost:8000/${foundCourse.image_thumbnail.replace(/\\/g, "/")}`
              : null,
            video_demo: foundCourse.video_demo || null,
          }

          setCourse(transformedCourse)
          return
        }

        const data = await response.json()

        // Transform image paths
        const transformedCourse = {
          ...data,
          image_thumbnail: data.image_thumbnail
            ? `http://localhost:8000/${data.image_thumbnail.replace(/\\/g, "/")}`
            : null,
          video_demo: data.video_demo || null,
        }

        setCourse(transformedCourse)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchCourse()
    }
  }, [id])

  if (loading) {
    return (
      <div className="course-detail-container d-flex justify-content-center align-items-center">
        <div className="text-center py-5">
          <div className="spinner-border text-purple" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-purple">Učitavanje kursa...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="course-detail-container">
        <div className="container py-5">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Greška pri učitavanju kursa!</h4>
            <p>{error}</p>
            <hr />
            <p className="mb-0">Molimo pokušajte ponovo kasnije ili kontaktirajte podršku.</p>
          </div>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="course-detail-container">
        <div className="container py-5">
          <div className="alert alert-warning" role="alert">
            <h4 className="alert-heading">Kurs nije pronađen!</h4>
            <p>Traženi kurs ne postoji ili je uklonjen.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="course-detail-container">
      <CourseHeader course={course} />
      <CourseInfo course={course} />
      <RelatedCourses />
    </div>
  )
}
