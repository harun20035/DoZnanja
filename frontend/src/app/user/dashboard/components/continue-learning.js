'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Play } from "lucide-react";
import { Button, Card, CardContent, LinearProgress, Typography } from "@mui/material";
import styles from "./continue-learning.module.css";

export function ContinueLearning() {
  const [recentCourses, setRecentCourses] = useState([]);

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

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}.`;
  };

  useEffect(() => {
    const token = localStorage.getItem("auth_token");

    if (!token) return;

    fetch("http://localhost:8000/user/last-enrollments", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Greška pri dohvaćanju kurseva");
        return res.json();
      })
      .then((data) => setRecentCourses(data))
      .catch((err) => console.error("Greška:", err));
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Typography variant="h5" component="h2" className={styles.title}>
          Nastavite sa učenjem
        </Typography>
      </div>

      <div className={styles.courseGrid}>
        {recentCourses.length === 0 ? (
          <p style={{ marginLeft: "1rem" }}>Još niste upisali nijedan kurs.</p>
        ) : (
          recentCourses.map((course) => (
            <Card key={course.course_id} className={styles.courseCard}>
              <CardContent className={styles.cardContent}>
                <div className={styles.courseLayout}>
                  <div
                    className={styles.imageContainer}
                    style={{ position: "relative", width: "200px", height: "120px" }}
                  >
                    <Image
                      src={normalizeImageUrl(course.image_thumbnail) || "/placeholder.svg"}
                      alt={course.title}
                      fill
                      className={styles.courseImage}
                      style={{ objectFit: "cover" }}
                    />
                  </div>

                  <div className={styles.courseInfo}>
                    <Typography variant="h6" component="h3" className={styles.courseTitle}>
                      {course.title}
                    </Typography>

                    <Typography variant="body2" className={styles.courseInstructor}>
                      Kupljeno: {formatDate(course.enrolled_at)}
                    </Typography>

                    <div className={styles.progressContainer}>
                      <div className={styles.progressHeader}>
                        <span className={styles.progressText}>{course.progress}% završeno</span>
                        <span className={styles.lessonText}>
                          {course.progress === 0 ? "Započnite kurs" : "Nastavite gdje ste stali"}
                        </span>
                      </div>
                      <LinearProgress
                        variant="determinate"
                        value={course.progress}
                        className={styles.progressBar}
                      />
                    </div>

                    <div className={styles.courseActions}>
                      <Button
                        size="small"
                        variant="contained"
                        className={styles.continueButton}
                        startIcon={<Play className={styles.playIcon} />}
                        href={`/user/dashboard/${course.course_id}`}
                      >
                        Nastavite
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
