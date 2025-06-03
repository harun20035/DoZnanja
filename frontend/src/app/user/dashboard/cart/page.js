'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Modal,
  Typography,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ErrorIcon from '@mui/icons-material/Error';
import styles from './Cart.module.css';

const normalizePath = (path) => {
  if (!path) return "/placeholder.svg";
  let fixed = path.replace(/\\/g, '/');
  if (fixed.startsWith('http://') || fixed.startsWith('https://')) return fixed;
  if (!fixed.startsWith('/')) fixed = '/' + fixed;
  return `http://localhost:8000${fixed}`;
};

export default function Cart() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [lowCreditsOpen, setLowCreditsOpen] = useState(false);
  const [missingCredits, setMissingCredits] = useState(0);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const res = await axios.get('http://localhost:8000/user/cart', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCourses(res.data);
      } catch (err) {
        console.error('Greška pri fetchanju korpe:', err.response?.data || err.message);
      }
    };

    fetchCourses();
  }, []);

  const handleBuyClick = (course) => {
    setSelectedCourse(course);
    setConfirmOpen(true);
  };

  const handleDetailsClick = (course) => {
    setSelectedCourse(course);
    setVideoOpen(true);
  };

  const confirmPurchase = async () => {
  setConfirmOpen(false);
  try {
    const token = localStorage.getItem('auth_token');
    await axios.post(`http://localhost:8000/user/purchase/${selectedCourse.id}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setSuccessOpen(true);
    setCourses(prev => prev.filter(c => c.id !== selectedCourse.id));
  } catch (err) {
    const detail = err.response?.data?.detail?.toLowerCase() || '';

    if (detail.includes("nedovoljno kredita")) {
      const match = detail.match(/nedostaje\s+(\d+)/i);
      if (match) {
        setMissingCredits(parseInt(match[1]));
      } else {
        setMissingCredits(0);
      }
      setLowCreditsOpen(true);
    } else {
      // fallback za sve ostale greške
      console.error("Greška pri kupovini:", err);
      alert("Greška pri kupovini: " + (detail || err.message));
    }
  }
};


  return (
    <Box className={styles.dashboardContainer}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Moja Korpa
      </Typography>

      <Grid container spacing={3} className={styles.courseGrid}>
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course.id}>
            <Card className={styles.courseCard}>
              <div className={styles.imageContainer}>
                <CardMedia
                  component="img"
                  height="180"
                  image={normalizePath(course.image_thumbnail)}
                  alt={course.title}
                  className={styles.courseImage}
                />
              </div>
              <CardContent className={styles.cardContent}>
                <Typography className={styles.courseTitle}>{course.title}</Typography>
                <Typography className={styles.courseInstructor}>
                  Autor: {course.name} {course.surname}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {course.description}
                </Typography>
                <Typography className={styles.salePrice}>Cijena: {course.price} KM</Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  startIcon={<ShoppingCartIcon />}
                  onClick={() => handleBuyClick(course)}
                >
                  Kupi
                </Button>
                <Button
                  size="small"
                  color="secondary"
                  startIcon={<InfoIcon />}
                  onClick={() => handleDetailsClick(course)}
                >
                  Detalji
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Modal: potvrda kupovine */}
      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <Box className={styles.modalBox}>
          <Typography variant="h6">
            Potvrditi kupovinu: <strong>{selectedCourse?.title}</strong>?
          </Typography>
          <Box className={styles.modalButtons}>
            <Button onClick={() => setConfirmOpen(false)} variant="outlined">
              Odustani
            </Button>
            <Button onClick={confirmPurchase} variant="contained" color="primary">
              Potvrdi
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Modal: uspješna kupovina */}
      <Modal open={successOpen} onClose={() => setSuccessOpen(false)}>
        <Box className={styles.modalBox}>
          <CheckCircleIcon sx={{ fontSize: 40, color: 'green', mb: 1 }} />
          <Typography variant="h6" fontWeight="bold">
            Uspješno ste kupili kurs!
          </Typography>
          <Typography variant="body2">{selectedCourse?.title}</Typography>
          <Box sx={{ marginTop: 2 }}>
            <Button onClick={() => setSuccessOpen(false)} variant="contained">
              Zatvori
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Modal: prikaz videa */}
      <Modal open={videoOpen} onClose={() => setVideoOpen(false)}>
        <Box className={styles.modalBox}>
          <Typography variant="h6" gutterBottom>
            Pregled kursa: {selectedCourse?.title}
          </Typography>
          {selectedCourse?.video_demo ? (
            <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
              <iframe
                src={normalizePath(selectedCourse.video_demo)}
                title="Video kursa"
                frameBorder="0"
                allowFullScreen
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                }}
              />
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Ovaj kurs trenutno nema video demonstraciju.
            </Typography>
          )}
          <Box sx={{ marginTop: 2 }}>
            <Button onClick={() => setVideoOpen(false)} variant="contained">
              Zatvori
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Modal: nedovoljno kredita */}
      <Modal open={lowCreditsOpen} onClose={() => setLowCreditsOpen(false)}>
        <Box className={styles.modalBox}>
          <ErrorIcon sx={{ fontSize: 40, color: 'red', mb: 1 }} />
          <Typography variant="h6" fontWeight="bold" color="error">
            Nedovoljno kredita!
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Nemate dovoljno kredita za kupovinu kursa <strong>{selectedCourse?.title}</strong>.
          </Typography>
          {missingCredits > 0 && (
            <Typography sx={{ mt: 1 }}>
              Nedostaje vam još <strong>{missingCredits} kredita</strong>.
            </Typography>
          )}
          <Box sx={{ marginTop: 2 }}>
            <Button onClick={() => setLowCreditsOpen(false)} variant="outlined" color="error">
              Zatvori
            </Button>
            <Button onClick={() => setLowCreditsOpen(false)} variant="contained" color="primary" sx={{ ml: 2 }}>
              Nadopuni kredite
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
