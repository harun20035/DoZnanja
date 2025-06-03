'use client';

import { useState } from 'react';
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
import styles from './Cart.module.css';

export default function Cart() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);

  // Tri statička kursa
  const course1 = {
    id: 1,
    title: 'React za početnike',
    description: 'Nauči osnove React biblioteke od nule.',
    image: '/images/react-course.jpg',
    price: 100,
    author: 'Marko Marković',
    videoUrl: 'https://www.youtube.com/embed/dGcsHMXbSOA',
  };

  const course2 = {
    id: 2,
    title: 'Next.js u praksi',
    description: 'Savladaj Next.js framework za moderne React aplikacije.',
    image: '/images/nextjs-course.jpg',
    price: 150,
    author: 'Jelena Jelić',
    videoUrl: 'https://www.youtube.com/embed/mTz0GXj8NN0',
  };

  const course3 = {
    id: 3,
    title: 'TypeScript od nule',
    description: 'Uči TypeScript i poboljšaj svoj JavaScript kod.',
    image: '/images/typescript-course.jpg',
    price: 120,
    author: 'Ivan Ivanković',
    videoUrl: 'https://www.youtube.com/embed/BwuLxPH8IDs',
  };

  const handleBuyClick = (course) => {
    setSelectedCourse(course);
    setConfirmOpen(true);
  };

  const handleDetailsClick = (course) => {
    setSelectedCourse(course);
    setVideoOpen(true);
  };

  const confirmPurchase = () => {
    setConfirmOpen(false);
    setSuccessOpen(true);
  };

  return (
    <Box className={styles.dashboardContainer}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Moja Korpa
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4} key={course1.id}>
          <Card className={styles.courseCard}>
            <div className={styles.imageContainer}>
              <CardMedia
                component="img"
                height="180"
                image={course1.image}
                alt={course1.title}
                className={styles.courseImage}
              />
            </div>
            <CardContent className={styles.cardContent}>
              <Typography className={styles.courseTitle}>{course1.title}</Typography>
              <Typography className={styles.courseInstructor}>Autor: {course1.author}</Typography>
              <Typography variant="body2" color="text.secondary">{course1.description}</Typography>
              <Typography className={styles.salePrice}>Cijena: {course1.price} KM</Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                color="primary"
                startIcon={<ShoppingCartIcon />}
                onClick={() => handleBuyClick(course1)}
              >
                Kupi
              </Button>
              <Button
                size="small"
                color="secondary"
                startIcon={<InfoIcon />}
                onClick={() => handleDetailsClick(course1)}
              >
                Detalji
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4} key={course2.id}>
          <Card className={styles.courseCard}>
            <div className={styles.imageContainer}>
              <CardMedia
                component="img"
                height="180"
                image={course2.image}
                alt={course2.title}
                className={styles.courseImage}
              />
            </div>
            <CardContent className={styles.cardContent}>
              <Typography className={styles.courseTitle}>{course2.title}</Typography>
              <Typography className={styles.courseInstructor}>Autor: {course2.author}</Typography>
              <Typography variant="body2" color="text.secondary">{course2.description}</Typography>
              <Typography className={styles.salePrice}>Cijena: {course2.price} KM</Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                color="primary"
                startIcon={<ShoppingCartIcon />}
                onClick={() => handleBuyClick(course2)}
              >
                Kupi
              </Button>
              <Button
                size="small"
                color="secondary"
                startIcon={<InfoIcon />}
                onClick={() => handleDetailsClick(course2)}
              >
                Detalji
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4} key={course3.id}>
          <Card className={styles.courseCard}>
            <div className={styles.imageContainer}>
              <CardMedia
                component="img"
                height="180"
                image={course3.image}
                alt={course3.title}
                className={styles.courseImage}
              />
            </div>
            <CardContent className={styles.cardContent}>
              <Typography className={styles.courseTitle}>{course3.title}</Typography>
              <Typography className={styles.courseInstructor}>Autor: {course3.author}</Typography>
              <Typography variant="body2" color="text.secondary">{course3.description}</Typography>
              <Typography className={styles.salePrice}>Cijena: {course3.price} KM</Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                color="primary"
                startIcon={<ShoppingCartIcon />}
                onClick={() => handleBuyClick(course3)}
              >
                Kupi
              </Button>
              <Button
                size="small"
                color="secondary"
                startIcon={<InfoIcon />}
                onClick={() => handleDetailsClick(course3)}
              >
                Detalji
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      {/* Modal: potvrda kupovine */}
      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <Box className={styles.modalBox}>
          <Typography variant="h6">
            Potvrditi kupovinu: <strong>{selectedCourse?.title}</strong>?
          </Typography>
          <Box className={styles.modalButtons}>
            <Button onClick={() => setConfirmOpen(false)} variant="outlined">Odustani</Button>
            <Button onClick={confirmPurchase} variant="contained" color="primary">Potvrdi</Button>
          </Box>
        </Box>
      </Modal>

      {/* Modal: uspješna kupovina */}
      <Modal open={successOpen} onClose={() => setSuccessOpen(false)}>
        <Box className={styles.modalBox}>
          <CheckCircleIcon sx={{ fontSize: 40, color: 'green', mb: 1 }} />
          <Typography variant="h6" fontWeight="bold">Uspješno ste kupili kurs!</Typography>
          <Typography variant="body2">{selectedCourse?.title}</Typography>
          <Box sx={{ marginTop: 2 }}>
            <Button onClick={() => setSuccessOpen(false)} variant="contained">Zatvori</Button>
          </Box>
        </Box>
      </Modal>

      {/* Modal: prikaz videa */}
      <Modal open={videoOpen} onClose={() => setVideoOpen(false)}>
        <Box className={styles.modalBox}>
          <Typography variant="h6" gutterBottom>Pregled kursa: {selectedCourse?.title}</Typography>
          <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
            <iframe
              src={selectedCourse?.videoUrl}
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
          <Box sx={{ marginTop: 2 }}>
            <Button onClick={() => setVideoOpen(false)} variant="contained">Zatvori</Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
