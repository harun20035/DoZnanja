"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import "./dashboard.css";

export default function MyCoursesSection() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const normalizeImageUrl = (path) => {
    if (!path) return null;

    let fixedPath = path.replace(/\\/g, "/");

    if (fixedPath.startsWith("http://") || fixedPath.startsWith("https://")) {
      return fixedPath;
    }

    if (!fixedPath.startsWith("/")) {
      fixedPath = "/" + fixedPath;
    }

    return `http://localhost:8000${fixedPath}`;
  };

  useEffect(() => {
    async function fetchCourses() {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("auth_token");

        const res = await fetch("http://localhost:8000/course/creator-courses", {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        if (!res.ok)
          throw new Error(`Failed to fetch courses: ${res.status} ${res.statusText}`);

        const data = await res.json();

        const mapped = data.map((course) => ({
          id: course.id,
          title: course.title,
          students: course.students ?? 0,
          rating: course.average_rating ?? 0,
          revenue: course.revenue ?? "$0",
          lastUpdated: new Date(course.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          published: course.status === "APPROVED",
          image_thumbnail: course.image_thumbnail,
          description: course.description,
        }));

        setCourses(mapped);
      } catch (error) {
        setError(error.message || "Something went wrong");
        setCourses([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="section">
        <p>Loading courses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section">
        <p style={{ color: "red" }}>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="section-header">
        <h2 className="section-title">My Courses</h2>
        <Link href="/creator/courses/new" className="btn-purple">
          Create New Course
        </Link>
      </div>

      <div className="course-list">
        {courses.length === 0 ? (
          <p>You have no courses yet.</p>
        ) : (
          courses.map((course) => (
            <div key={course.id} className="course-card">
              <div
                className="course-image-wrapper"
                style={{ position: "relative", width: "192px", height: "175px" }}
              >
                {course.image_thumbnail ? (
                  <Image
                    src={normalizeImageUrl(course.image_thumbnail)}
                    alt={course.title}
                    fill
                    className="course-image"
                    priority
                    sizes="192px"
                  />
                ) : (
                  <Image
                    src="/placeholder.svg"
                    alt="Placeholder"
                    fill
                    className="course-image"
                    priority
                    sizes="192px"
                  />
                )}
                {!course.published && <span className="draft-badge">Draft</span>}
              </div>

              <div className="course-content">
                <div className="course-header">
                  <h3 className="course-title">{course.title}</h3>
                  <div className="course-actions">
                    <button className="btn-outline">✏ Edit</button>
                    <button className="btn-outline">👁 Preview</button>
                    <button className="btn-outline">📊 Stats</button>
                  </div>
                </div>

                <div className="course-info">
                  <div>
                    <p className="info-label">Students</p>
                    <p>{course.students > 0 ? course.students : "N/A"}</p>
                  </div>
                  <div>
                    <p className="info-label">Rating</p>
                    <p>{course.rating > 0 ? course.rating.toFixed(1) : "N/A"}</p>
                  </div>
                  <div>
                    <p className="info-label">Revenue</p>
                    <p>{course.revenue}</p>
                  </div>
                  <div>
                    <p className="info-label">Last Updated</p>
                    <p>{course.lastUpdated}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
