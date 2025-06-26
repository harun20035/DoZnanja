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
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [showToast, setShowToast] = useState(false);

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

  const handleCreateQuizClick = async (courseId) => {
    const token = localStorage.getItem("auth_token");
    try {
      const res = await fetch(`http://localhost:8000/quiz/exists/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      let data = null;
      try {
        data = await res.json();
      } catch (e) {
        data = { exists: false };
      }

      setSelectedCourseId(courseId);
      if (res.ok && data.exists) {
        setShowDeleteModal(true);
      } else {
        setShowCreateModal(true);
      }
    } catch (err) {
      setSelectedCourseId(courseId);
      setShowCreateModal(true);
    }
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
      setShowCreateModal(false);
    }
  };

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
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem("auth_token");

      const res = await fetch(`http://localhost:8000/quiz/delete/${selectedCourseId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Brisanje nije uspjelo.");

      setShowDeleteModal(false);
      setSelectedCourseId(null);
      alert("🗑️ Kviz obrisan.");
      await fetchCourses();
    } catch (err) {
      alert("Greška pri brisanju kviza: " + err.message);
      setShowDeleteModal(false);
      setSelectedCourseId(null);
    }
  };

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
                  {course.status && (
                    <span className="draft-badge">
                      {course.status === "APPROVED"
                        ? "Odobren"
                        : course.status === "PENDING"
                        ? "Na čekanju"
                        : course.status === "REJECTED"
                        ? "Odbijen"
                        : course.status}
                    </span>
                  )}

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

      {showCreateModal && (
        <div style={modalBackdropStyle}>
          <div style={modalStyle}>
            <h3 style={{ marginBottom: "1rem", color: "#6a0dad" }}>
              Želite li kreirati kviz za ovaj kurs?
            </h3>
            <div style={modalActionsStyle}>
              <button style={confirmButtonStyle} onClick={handleConfirmCreate}>Da</button>
              <button style={cancelButtonStyle} onClick={() => setShowCreateModal(false)}>Ne</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div style={modalBackdropStyle}>
          <div style={modalStyle}>
            <h3 style={{ marginBottom: "1rem", color: "#cc0000" }}>
              Kviz za ovaj kurs već postoji. Želite li ga izbrisati?
            </h3>
            <div style={modalActionsStyle}>
              <button style={confirmButtonStyle} onClick={handleConfirmDelete}>
                  Izbriši
              </button>
              <button style={cancelButtonStyle} onClick={() => setShowDeleteModal(false)}>Odustani</button>
            </div>
          </div>
        </div>
      )}

      {showToast && error && (
        <div style={{
          position: "fixed",
          bottom: "30px",
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "#ffe6e6",
          color: "#cc0000",
          padding: "1rem 1.5rem",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          fontWeight: "bold",
          zIndex: 9999,
          animation: "fadeInOut 3s ease-in-out"
        }}>
          {error}
        </div>
      )}
    </>
  );
}

const modalBackdropStyle = {
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
};

const modalStyle = {
  backgroundColor: "white",
  padding: "2rem",
  borderRadius: "12px",
  width: "90%",
  maxWidth: "400px",
  boxShadow: "0 0 20px rgba(0,0,0,0.25)",
  textAlign: "center"
};

const modalActionsStyle = {
  display: "flex",
  justifyContent: "space-around",
  marginTop: "1.5rem"
};

const confirmButtonStyle = {
  backgroundColor: "#6a0dad",
  color: "white",
  padding: "0.6rem 1.2rem",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
};

const cancelButtonStyle = {
  border: "2px solid #6a0dad",
  backgroundColor: "white",
  color: "#6a0dad",
  padding: "0.6rem 1.2rem",
  borderRadius: "8px",
  cursor: "pointer"
};
