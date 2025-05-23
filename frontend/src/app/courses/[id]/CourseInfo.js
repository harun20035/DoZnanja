"use client"

import { useState } from "react"
import Image from "next/image"
import CourseDescription from "./CourseDescription"
import CourseCurriculum from "./CourseCurriculum"
import CourseInstructor from "./CourseInstructor"
import CourseReviews from "./CourseReviews"

export default function CourseInfo({ course }) {
  const [activeTab, setActiveTab] = useState("description")

  // Format image URL if needed
  const imageUrl = course.image_thumbnail
    ? course.image_thumbnail.startsWith("http")
      ? course.image_thumbnail
      : `http://localhost:8000/${course.image_thumbnail.replace(/\\/g, "/")}`
    : "/placeholder.svg?height=450&width=800"

  // Format video URL if needed
  const videoUrl = course.video_demo
    ? course.video_demo.startsWith("http")
      ? course.video_demo
      : `http://localhost:8000/${course.video_demo.replace(/\\/g, "/")}`
    : null

  return (
    <div className="course-content-section">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 course-main-content">
            {/* Course Image or Video */}
            {videoUrl ? (
              <div className="video-container">
                <iframe src={videoUrl} title={course.title} allowFullScreen></iframe>
              </div>
            ) : (
              <div className="mb-4">
                <Image
                  src={imageUrl || "/placeholder.svg"}
                  alt={course.title}
                  width={800}
                  height={450}
                  className="course-image"
                />
              </div>
            )}

            {/* Course Tabs */}
            <div className="course-tabs">
              <ul className="nav nav-tabs" id="courseTabs" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === "description" ? "active" : ""}`}
                    onClick={() => setActiveTab("description")}
                    type="button"
                  >
                    <i className="bi bi-info-circle me-2"></i>
                    Opis
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === "curriculum" ? "active" : ""}`}
                    onClick={() => setActiveTab("curriculum")}
                    type="button"
                  >
                    <i className="bi bi-list-check me-2"></i>
                    Kurikulum
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === "instructor" ? "active" : ""}`}
                    onClick={() => setActiveTab("instructor")}
                    type="button"
                  >
                    <i className="bi bi-person me-2"></i>
                    Instruktor
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === "reviews" ? "active" : ""}`}
                    onClick={() => setActiveTab("reviews")}
                    type="button"
                  >
                    <i className="bi bi-star me-2"></i>
                    Recenzije
                  </button>
                </li>
              </ul>

              <div className="tab-content">
                {activeTab === "description" && <CourseDescription course={course} />}
                {activeTab === "curriculum" && <CourseCurriculum course={course} />}
                {activeTab === "instructor" && <CourseInstructor course={course} />}
                {activeTab === "reviews" && <CourseReviews course={course} />}
              </div>
            </div>
          </div>

          <div className="col-lg-4 course-sidebar">
            <div className="course-price-card">
              <div className="course-price-header">
                {course.discount_percent > 0 ? (
                  <>
                    <p className="course-original-price">{course.price.toFixed(2)} kredita</p>
                    <p className="course-price">
                      {(course.price * (1 - course.discount_percent / 100)).toFixed(2)} kredita
                      <span className="course-discount">-{course.discount_percent}%</span>
                    </p>
                  </>
                ) : (
                  <p className="course-price">{course.price.toFixed(2)} kredita</p>
                )}
              </div>
              <div className="course-price-body">
                <ul className="course-features">
                  <li>
                    <i className="bi bi-play-circle-fill"></i>
                    <span>Pristup svim lekcijama</span>
                  </li>
                  <li>
                    <i className="bi bi-file-earmark-text-fill"></i>
                    <span>Pristup materijalima za učenje</span>
                  </li>
                  <li>
                    <i className="bi bi-award-fill"></i>
                    <span>Certifikat o završetku</span>
                  </li>
                  <li>
                    <i className="bi bi-infinity"></i>
                    <span>Doživotni pristup</span>
                  </li>
                  <li>
                    <i className="bi bi-phone-fill"></i>
                    <span>Pristup na svim uređajima</span>
                  </li>
                </ul>
                <button className="btn btn-purple w-100 mb-3">
                  <i className="bi bi-cart-plus me-2"></i>
                  Dodaj u korpu
                </button>
                <button className="btn btn-outline-purple w-100">
                  <i className="bi bi-heart me-2"></i>
                  Dodaj u favorite
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
