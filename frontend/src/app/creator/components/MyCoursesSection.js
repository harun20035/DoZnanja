'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import "./dashboard.css";

export default function MyCoursesSection() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const normalizeImageUrl = (path) => {
    if (!path) return "/placeholder.svg";
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

        const headers = {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        };

        const [basicRes, statsRes] = await Promise.all([
          fetch("http://localhost:8000/course/creator-courses", { headers }),
          fetch("http://localhost:8000/course/creator-courses/stats", { headers }),
        ]);

        if (!basicRes.ok || !statsRes.ok) {
          throw new Error("Neuspješno dohvaćanje podataka.");
        }

        const basicCourses = await basicRes.json();
        const stats = await statsRes.json();

        const statsMap = new Map(stats.map((s) => [s.id, s]));

        const mapped = basicCourses.map((course) => {
          const stat = statsMap.get(course.id) || {};

          return {
            id: course.id,
            title: course.title,
            description: course.description,
            image_thumbnail: course.image_thumbnail,
            status: course.status,
            created_at: course.created_at,
            students: stat.students ?? 0,
            rating: stat.average_rating ?? 0,
            revenue: stat.revenue ?? "0.00 KM",
            lastUpdated: course.created_at
              ? new Date(course.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "N/A",
            published: course.status === "APPROVED",
          };
        });

        setCourses(mapped);
      } catch (error) {
        setError(error.message || "Došlo je do greške.");
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
        <p>Učitavanje kurseva...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section">
        <p style={{ color: "red" }}>Greška: {error}</p>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="section-header">
        <h2 className="section-title">Moji Kursevi</h2>
        <Link href="/creator/create" className="btn-purple">
          Kreiraj Novi Kurs
        </Link>
      </div>

      <div className="course-list">
        {courses.length === 0 ? (
          <p>Nemate još kurseva.</p>
        ) : (
          courses.map((course) => (
            <div key={course.id} className="course-card">
              <div
                className="course-image-wrapper"
                style={{ position: "relative", width: "192px", height: "175px" }}
              >
                <Image
                  src={normalizeImageUrl(course.image_thumbnail)}
                  alt={course.title}
                  fill
                  className="course-image"
                  priority
                  sizes="192px"
                />
                {!course.published && <span className="draft-badge">Skica</span>}
              </div>

              <div className="course-content">
                <div className="course-header">
                  <h3 className="course-title">{course.title}</h3>
                  <div className="course-actions">
                    <Link href={`/creator/${course.id}`} className="btn-outline">✏ Uredi</Link>
                    <Link href={`/creator/${course.id}/quiz`} className="btn-outline">✏ Kreiraj kviz </Link>
                    
                    <button className="btn-outline">📊 Statistika</button>
                  </div>
                </div>

                <div className="course-info">
                  <div>
                    <p className="info-label">Polaznici</p>
                    <p>{course.students > 0 ? course.students : "N/A"}</p>
                  </div>
                  <div>
                    <p className="info-label">Ocjena</p>
                    <p>{course.rating > 0 ? course.rating.toFixed(1) : "N/A"}</p>
                  </div>
                  <div>
                    <p className="info-label">Prihod</p>
                    <p>{course.revenue}</p>
                  </div>
                  <div>
                    <p className="info-label">Posljednja izmjena</p>
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
