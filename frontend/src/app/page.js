"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import "./styles.css";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";

export default function HomePage() {
  const [categoryCounts, setCategoryCounts] = useState([]); // Držimo podatke o broju kurseva po kategorijama
  const [topCourses, setTopCourses] = useState([]); // Držimo podatke o istaknutim kursevima
  const [stats, setStats] = useState(null); // Držimo podatke o statistikama
  const [loading, setLoading] = useState(true); // Za upravljanje loading statusom

  // Prevod sa engleskog na bosanski jezik
  const categoryTranslations = {
    "Programming": "Programiranje",
    "Design": "Dizajn",
    "Marketing": "Marketing",
    "Business": "Biznis",
    "Photography": "Fotografija"
  };

  // Ikone za svaku kategoriju
  const categoryIcons = {
    "Programming": "💻",
    "Design": "🎨",
    "Marketing": "📊",
    "Business": "💼",
    "Photography": "📷"
  };

  // Funkcija za normalizaciju putanja slika
  const normalizePath = (path) => {
    if (!path) return "/placeholder.svg"; // Ako nema puta, koristi placeholder
    let fixed = path.replace(/\\/g, '/'); // Zamena backslash-a za forward slash
    if (fixed.startsWith('http://') || fixed.startsWith('https://')) return fixed; // Ako je URL, vraćamo ga kako jeste
    if (!fixed.startsWith('/')) fixed = '/' + fixed; // Dodajemo početni slash ako ga nema
    return `http://localhost:8000${fixed}`; // Lokalni server za slike
  };

  useEffect(() => {
    // Poziv API-ja za broj kurseva po kategorijama
    fetch("http://localhost:8000/user/courses/category-counts")
      .then((response) => response.json())
      .then((data) => {
        setCategoryCounts(data); // Postavljanje podataka u state
        setLoading(false); // Kada podaci stignu, loading je false
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setLoading(false); // Ako dođe do greške, prestajemo sa loadingom
      });

    // Poziv API-ja za istaknute kurseve
    fetch("http://localhost:8000/user/popular-courses")
      .then((response) => response.json())
      .then((data) => {
        setTopCourses(data); // Postavljanje podataka o istaknutim kursevima
      })
      .catch((error) => {
        console.error("Error fetching top courses: ", error);
      });

    // Poziv API-ja za statistiku (ukupan broj kurseva, kreatora, i upisanih korisnika)
    fetch("http://localhost:8000/user/courses/stats")
      .then((response) => response.json())
      .then((data) => {
        setStats(data); // Postavljanje podataka o statistici
      })
      .catch((error) => {
        console.error("Error fetching stats: ", error);
      });
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header role="guest" />

      <main className="flex-grow-1">
        {/* Hero Section */}
        <section className="bg-light py-5">
          <div className="container py-4">
            <div className="row align-items-center g-5">
              <div className="col-lg-6">
                <div className="mb-4">
                  <h1 className="display-4 fw-bold mb-3">Uči bilo gdje, bilo kada</h1>
                  <p className="lead text-secondary mb-4">
                    Pristup hiljadama kurseva iz različitih oblasti. Unaprijedi svoje vještine i karijeru već danas.
                  </p>
                  <div className="d-flex flex-column flex-sm-row gap-2">
                    <a href="/register" className="btn btn-primary btn-lg">
                      Započni učenje
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-5">
          <div className="container">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
              <div className="mb-3 mb-md-0">
                <h2 className="fw-bold">Popularne kategorije</h2>
                <p className="text-secondary">Istraži najpopularnije oblasti učenja</p>
              </div>
            </div>

            <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-3">
              {loading ? (
                <div>Loading...</div> // Prikazuje se dok čekamo podatke
              ) : (
                categoryCounts.map((category) => (
                  <div key={category.category} className="col">
                    
                      <div className="card h-100 text-center border-light hover-card">
                        <div className="card-body">
                          <div className="category-icon bg-primary-subtle text-primary rounded-circle mx-auto mb-3">
                            <span className="fs-4">{categoryIcons[category.category]}</span>
                          </div>
                          <h5 className="card-title fs-6 fw-medium">
                            {categoryTranslations[category.category] || category.category} {/* Prevod kategorije */}
                          </h5>
                          <p className="card-text small text-secondary">{category.course_count} kurseva</p>
                        </div>
                      </div>
                    
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Featured Courses */}
        <section className="py-5">
          <div className="container">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
              <div className="mb-3 mb-md-0">
                <h2 className="fw-bold mb-2">Istaknuti kursevi</h2>
                <p className="text-secondary">Najpopularniji kursevi ove sedmice</p>
              </div>
            </div>

            <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4">
              {loading ? (
                <div>Loading...</div> // Prikazuje se dok čekamo podatke
              ) : (
                topCourses.map((course) => (
                  <div key={course.id} className="col">
                    <div className="card h-100 border-light shadow-sm hover-card">
                      <div className="course-image-container">
                        <img
                          src={normalizePath(course.image)} // Normalizuj putanju slike
                          alt={course.title}
                          style={{ width: "100%", height: "auto" }}
                        />
                      </div>
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="badge bg-light text-dark">{course.category}</span>
                          <small className="text-secondary d-flex align-items-center">
                            <span className="me-1">👥</span>
                            <span className="course-stats">{course.students}</span>
                          </small>
                        </div>
                        <h5 className="card-title text-truncate">{course.title}</h5>
                        <p className="text-secondary">Kreator: {course.creator_name}</p> {/* Dodan kreator */}
                      </div>
                      <div className="card-footer bg-white d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <small className="fw-medium">{course.creator_name}</small>
                        </div>
                        <span className="fw-bold">{course.sale_price} €</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-5 bg-light">
          <div className="container py-3">
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4 text-center">
              {stats ? (
                <div className="col">
                  <div className="py-3">
                    <div className="display-5 fw-bold mb-1">{stats.total_courses}</div>
                    <div className="text-secondary">Aktivnih kurseva</div>
                  </div>
                </div>
              ) : (
                <div>Loading stats...</div>
              )}
              {stats ? (
                <div className="col">
                  <div className="py-3">
                    <div className="display-5 fw-bold mb-1">{stats.total_creators}</div>
                    <div className="text-secondary">Stručnih predavača</div>
                  </div>
                </div>
              ) : (
                <div>Loading stats...</div>
              )}
              {stats ? (
                <div className="col">
                  <div className="py-3">
                    <div className="display-5 fw-bold mb-1">{stats.total_enrolled_users}</div>
                    <div className="text-secondary">Zadovoljnih polaznika</div>
                  </div>
                </div>
              ) : (
                <div>Loading stats...</div>
              )}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-5 bg-white text-purple">
          <div className="container py-3 text-center">
            <h3 className="fw-bold mb-3">Spreman da započneš svoje putovanje učenja?</h3>
            <p className="mx-auto mb-4" style={{ maxWidth: "600px" }}>
              Pridruži se hiljadama polaznika koji svakodnevno unapređuju svoje vještine na DoZnanja platformi.
            </p>
            <a href="/register" className="btn btn-purple btn-lg px-4 fw-medium text-white">
              Registruj se besplatno
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
