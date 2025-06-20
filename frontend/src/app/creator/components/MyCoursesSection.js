'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import "./dashboard.css";

export default function MyCoursesSection() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  const router = useRouter();

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

  const handleCreateQuizClick = (courseId) => {
    setSelectedCourseId(courseId);
    setShowModal(true);
  };

  const handleConfirmCreate = async () => {
    try {
      const token = localStorage.getItem("auth_token");

      const response = await fetch("http://localhost:8000/quiz/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          course_id: selectedCourseId,
          title: "Novi Kviz",
          description: "Opis kviza...",
        }),
      });

      if (!response.ok) throw new Error("Greška pri kreiranju kviza");

      router.push(`/creator/${selectedCourseId}/quiz`);
    } catch (err) {
      alert("Greška: " + err.message);
    } finally {
      setShowModal(false);
    }
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

  return (
    <>
      <div className="section">
        <div className="section-header">
          <h2 className="section-title">Moji Kursevi</h2>
          <Link href="/creator/create" className="btn-purple">
            Kreiraj Novi Kurs
          </Link>
        </div>

        <div className="course-list">
          {loading ? (
            <p>Učitavanje kurseva...</p>
          ) : error ? (
            <p style={{ color: "red" }}>Greška: {error}</p>
          ) : courses.length === 0 ? (
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
                      <Link href={`/creator/${course.id}`} className="btn-outline">
                        ✏ Uredi
                      </Link>
                      <button onClick={() => handleCreateQuizClick(course.id)} className="btn-outline">
                        ✏ Kreiraj kviz
                      </button>
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

      {/* NOVI MODAL */}
      {showModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0,0,0,0.4)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <div style={{
            backgroundColor: "white",
            padding: "2rem",
            borderRadius: "12px",
            width: "90%",
            maxWidth: "400px",
            boxShadow: "0 0 20px rgba(0,0,0,0.25)",
            textAlign: "center"
          }}>
            <h3 style={{ marginBottom: "1rem", color: "#6a0dad" }}>
              Želite li kreirati kviz za ovaj kurs?
            </h3>
            <div style={{ display: "flex", justifyContent: "space-around", marginTop: "1.5rem" }}>
              <button
                style={{
                  backgroundColor: "#6a0dad",
                  color: "white",
                  padding: "0.6rem 1.2rem",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer"
                }}
                onClick={handleConfirmCreate}
              >
                Da
              </button>
              <button
                style={{
                  border: "2px solid #6a0dad",
                  backgroundColor: "white",
                  color: "#6a0dad",
                  padding: "0.6rem 1.2rem",
                  borderRadius: "8px",
                  cursor: "pointer"
                }}
                onClick={() => setShowModal(false)}
              >
                Ne
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
