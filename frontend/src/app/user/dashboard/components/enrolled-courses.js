import { useState, useEffect } from "react";
import { Button, Card, CardContent, LinearProgress, Typography } from "@mui/material";
import { Star } from "lucide-react";
import Image from "next/image";
import styles from "./enrolled-courses.module.css";

export function EnrolledCourses() {
  const [courses, setCourses] = useState([]);

  // Funkcija za normalizaciju putanje slike
  const normalizeImageUrl = (path) => {
    if (!path) return null;
    let fixedPath = path.replace(/\\/g, "/"); // Zamijeni backslash sa forward slash
    if (fixedPath.startsWith("http://") || fixedPath.startsWith("https://")) {
      return fixedPath;
    }
    if (!fixedPath.startsWith("/")) {
      fixedPath = "/" + fixedPath;
    }
    return `http://localhost:8000${fixedPath}`; // Putanja već ima /images/ u backendu, samo normaliziraj putanju
  };

  // Dohvati kupljene kurseve
  useEffect(() => {
    const token = localStorage.getItem("auth_token");

    if (!token) return;

    fetch("http://localhost:8000/user/user-courses", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Greška pri dohvaćanju kurseva");
        return res.json();
      })
      .then((data) => {
        // Normaliziraj putanju slike i postavi podatke
        const coursesWithNormalizedImages = data.map((course) => {
          const normalizedImagePath = course.image_thumbnail
            ? course.image_thumbnail.replace(/\\/g, "/") // Normaliziraj putanju, bez dodavanja /images/
            : "/placeholder.svg"; // fallback ako nema slike
          return { ...course, image: normalizedImagePath };
        });
        setCourses(coursesWithNormalizedImages); // Postavi dohvaćene kurseve u state
      })
      .catch((err) => console.error("Greška:", err));
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Typography variant="h5" component="h2" className={styles.title}>
          Moji upisani kursevi
        </Typography>
      </div>

      <div className={styles.courseGrid}>
        {courses.length === 0 ? (
          <Typography variant="body1" color="textSecondary">
            Nemate upisanih kurseva.
          </Typography>
        ) : (
          courses.map((course) => (
            <Card key={course.id} className={styles.courseCard}>
              <div
                className={styles.imageContainer}
                style={{ position: "relative", width: "280px", height: "160px" }}
              >
                <Image
                  src={normalizeImageUrl(course.image || "/placeholder.svg")} // Koristi normaliziranu putanju
                  alt={course.title}
                  fill
                  className={styles.courseImage}
                  style={{ objectFit: "cover" }}
                />
                <div className={styles.categoryBadge}>{course.category}</div>
              </div>
              <CardContent className={styles.cardContent}>
                <Typography variant="h6" component="h3" className={styles.courseTitle}>
                  Naslov: {course.title}
                </Typography>
                <Typography variant="body2" className={styles.courseInstructor}>
                  Autor: {course.creator_name} {/* Prikazuje ime kreatora */}
                </Typography>

                {/* Opis i Description u dva reda */}
                <div className={styles.courseDescription}>
                  <Typography variant="body2" className={styles.courseDescriptionText}>
                    Opis: {course.description}
                  </Typography>
                </div>

                <div className={styles.courseFooter}>
                  <div className={styles.rating}>
                    <Star className={styles.starIcon} />
                    <span>{course.average_rating}</span>
                  </div>
                  <Button size="small" variant="contained" className={styles.continueButton}>
                    Nastavi
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      
    </div>
  );
}
