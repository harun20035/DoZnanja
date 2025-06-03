import { useState, useEffect } from "react";
import { Button, Card, CardContent, Typography, Box, Modal, Fade } from "@mui/material";
import Image from "next/image";
import { Star, Users, Clock } from "lucide-react";
import Link from "next/link";
import styles from "./popular-courses.module.css";

export function PopularCourses() {
  const [courses, setCourses] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [courseToAdd, setCourseToAdd] = useState(null);

  // Funkcija za normalizaciju putanje slike
  const normalizeImageUrl = (path) => {
    if (!path) return "/placeholder.svg"; // Ako nema slike, koristi placeholder
    let fixedPath = path.replace(/\\/g, "/"); // Zamijeni backslash sa forward slash
    if (fixedPath.startsWith("http://") || fixedPath.startsWith("https://")) {
      return fixedPath;
    }
    if (!fixedPath.startsWith("/")) {
      fixedPath = "/" + fixedPath;
    }
    return `http://localhost:8000${fixedPath}`; // Dodaj osnovnu URL putanju za slike s backend-a
  };

  useEffect(() => {
    const token = localStorage.getItem("auth_token");

    fetch("http://localhost:8000/user/popular-courses", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // Provjeri je li odgovor niz
        if (Array.isArray(data)) {
          setCourses(data); // Ako je odgovor niz, postavi direktno
        } else {
          setCourses(data.courses || []); // Ako je objekat, koristi data.courses
        }
      })
      .catch((err) => console.error("Error fetching courses:", err));
  }, []);

  const handleAddToCart = (courseId) => {
  const token = localStorage.getItem("auth_token"); // Uzmi token iz localStorage
  console.log(courseId)

  // Provjera ako postoji token
  if (!token) {
    console.error("Token nije pronađen");

    return;
  }

  fetch("http://localhost:8000/user/add-to-cart", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,  // Poslati token u Authorization header
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ course_id: courseId }), // Samo šaljemo course_id jer user_id izvučemo iz tokena
  })
    .then((res) => res.json())
    .then((data) => {
      setModalMessage(data.message);
      setOpenModal(true);
    })
    .catch((err) => {
      console.error("Greška:", err);
      setModalMessage("Greška pri dodavanju kursa u korpu.");
      setOpenModal(true);
    });
};





  const handleCloseModal = () => setOpenModal(false);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Typography variant="h5" component="h2" className={styles.title}>
          Popular Courses
        </Typography>
        <Link href="/courses" className={styles.browseLink}>
          Browse all courses
        </Link>
      </div>

      <div className={styles.courseGrid}>
        {courses.length === 0 ? (
          <Typography variant="body1" color="textSecondary">
            No popular courses found.
          </Typography>
        ) : (
          courses.map((course) => (
            <Card key={course.id} className={styles.courseCard}>
              <Box className={styles.imageContainer} position="relative">
                <Image
                  src={normalizeImageUrl(course.image || "/placeholder.svg")} // Koristi normaliziranu putanju
                  alt={course.title}
                  fill
                  className={styles.courseImage}
                />
                <div className={styles.levelBadge}>{course.category}</div>
              </Box>
              <CardContent className={styles.cardContent}>
                <Typography variant="h6" className={styles.courseTitle}>
                  {course.title}
                </Typography>
                <Typography variant="body2" className={styles.courseInstructor}>
                  by {course.creator_name}
                </Typography>

                <Box className={styles.courseStats} display="flex" alignItems="center" gap={1}>
                  <Box className={styles.rating} display="flex" alignItems="center" gap={0.5}>
                    <Star className={styles.starIcon} />
                    <Typography variant="body2" className={styles.ratingValue}>
                      {course.average_rating}
                    </Typography>
                  </Box>
                  <div className={styles.statDivider}>|</div>
                  <Box className={styles.students} display="flex" alignItems="center" gap={0.5}>
                    <Users className={styles.studentsIcon} />
                    <Typography variant="body2">{course.students} students</Typography>
                  </Box>
                </Box>

                <Box className={styles.courseDuration} display="flex" alignItems="center" gap={0.5}>
                  <Clock className={styles.durationIcon} />
                  <Typography variant="body2">{course.steps} steps</Typography> {/* Zamijenjeno sa koracima */}
                </Box>

                <Box className={styles.courseFooter} display="flex" justifyContent="space-between" alignItems="center">
                  <Box className={styles.priceContainer}>
                    <Typography variant="h6" component="span" className={styles.salePrice}>
                      ${course.sale_price}
                    </Typography>
                    <Typography variant="body2" component="span" className={styles.originalPrice} sx={{ marginLeft: 1 }} >
                      ${course.price}
                    </Typography>
                  </Box>
                  <Button size="small" className={styles.addButton} onClick={() => handleAddToCart(course.id)}>
                    Add to Cart
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modal za obavještenje */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        closeAfterTransition
      >
        <Fade in={openModal}>
          <Box className={styles.modal}>
            <Typography variant="h6">{modalMessage}</Typography>
            <Button onClick={handleCloseModal} variant="contained">
              Close
            </Button>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
