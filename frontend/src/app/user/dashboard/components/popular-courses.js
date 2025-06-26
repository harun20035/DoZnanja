import { useState, useEffect } from "react";
import { Button, Card, CardContent, Typography, Box, Modal, Fade } from "@mui/material";
import Image from "next/image";
import { Star, Users, Clock, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import styles from "./popular-courses.module.css";

export function PopularCourses() {
  const [courses, setCourses] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalSuccess, setModalSuccess] = useState(true); // Novo stanje za prikaz kvake ili iksa

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
    const token = localStorage.getItem("auth_token");

    fetch("http://localhost:8000/user/popular-courses", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCourses(data);
        } else {
          setCourses(data.courses || []);
        }
      })
      .catch((err) => console.error("Greška pri dohvaćanju kurseva:", err));
  }, []);

  const handleAddToCart = (courseId) => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      console.error("Token nije pronađen");
      return;
    }

    fetch("http://localhost:8000/user/add-to-cart", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ course_id: courseId }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setModalMessage(data.message);
          setModalSuccess(true);
        } else {
          setModalMessage(data.detail || "Greška pri dodavanju kursa u korpu.");
          setModalSuccess(false);
        }
        setOpenModal(true);
      })
      .catch((err) => {
        console.error("Greška:", err);
        setModalMessage("Greška pri dodavanju kursa u korpu.");
        setModalSuccess(false);
        setOpenModal(true);
      });
  };

  const handleCloseModal = () => setOpenModal(false);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Typography variant="h5" component="h2" className={styles.title}>
          Popularni kursevi
        </Typography>
        <Link href="/all-courses" className={styles.browseLink}>
          Pregledaj sve kurseve
        </Link>
      </div>

      <div className={styles.courseGrid}>
        {courses.length === 0 ? (
          <Typography variant="body1" color="textSecondary">
            Nema popularnih kurseva.
          </Typography>
        ) : (
          courses.map((course) => (
            <Card key={course.id} className={styles.courseCard}>
              <Box className={styles.imageContainer} position="relative">
                <Image
                  src={normalizeImageUrl(course.image || "/placeholder.svg")}
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
                  od {course.creator_name}
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
                    <Typography variant="body2">{course.students} polaznika</Typography>
                  </Box>
                </Box>

                <Box className={styles.courseDuration} display="flex" alignItems="center" gap={0.5}>
                  <Clock className={styles.durationIcon} />
                  <Typography variant="body2">{course.steps} koraka</Typography>
                </Box>

                <Box className={styles.courseFooter} display="flex" justifyContent="space-between" alignItems="center">
                  <Box className={styles.priceContainer}>
                    <Typography variant="h6" component="span" className={styles.salePrice}>
                      ${Number(course.sale_price).toFixed(2)}
                    </Typography>
                    {Number(course.sale_price) < Number(course.price) && (
                      <Typography variant="body2" component="span" className={styles.originalPrice} sx={{ marginLeft: 1 }}>
                        ${Number(course.price).toFixed(2)}
                      </Typography>
                    )}


                  </Box>
                  <Button size="small" className={styles.addButton} onClick={() => handleAddToCart(course.id)}>
                    KORPA
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modal sa ikonama */}
      <Modal open={openModal} onClose={handleCloseModal} closeAfterTransition>
        <Fade in={openModal}>
          <Box className={`${styles.modal} ${modalSuccess ? styles.success : styles.error}`}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              {modalSuccess ? (
                <CheckCircle color="green" size={32} />
              ) : (
                <XCircle color="red" size={32} />
              )}
              <Typography variant="h6">{modalMessage}</Typography>
            </Box>
            <Button onClick={handleCloseModal} variant="contained">
              Zatvori
            </Button>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
