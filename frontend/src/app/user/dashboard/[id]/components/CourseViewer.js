"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Card,
  CardMedia,
  Chip,
  Divider,
  Container,
  Grid,
  Paper,
} from "@mui/material"
import { PlayCircleOutline, CheckCircle, RadioButtonUnchecked, School, AccessTime } from "@mui/icons-material"
import styles from "./CourseViewer.module.css"

const normalizePath = (path) => {
  if (!path) return "/placeholder.svg?height=300&width=400"
  let fixed = path.replace(/\\/g, "/")
  if (fixed.startsWith("http://") || fixed.startsWith("https://")) return fixed
  if (!fixed.startsWith("/")) fixed = "/" + fixed
  return `http://localhost:8000${fixed}`
}

export default function CourseViewer({ courseId }) {
  const [course, setCourse] = useState(null)
  const [steps, setSteps] = useState([])
  const [selectedStep, setSelectedStep] = useState(null)
  const [completedSteps, setCompletedSteps] = useState(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Hardcoded course data
    const hardcodedCourse = {
      id: 1,
      title: "Kompletni React.js Kurs za Početnike",
      description:
        "Naučite React.js od osnova do naprednih koncepata. Ovaj kurs pokriva sve što trebate znati da postanete React developer.",
      price: 199.99,
      category: "Programming",
      image_thumbnail: "/placeholder.svg?height=300&width=400",
      video_demo: "https://www.youtube.com/embed/dGcsHMXbSOA",
      average_rating: 4.8,
      creator_name: "Marko",
      creator_surname: "Petrović",
    }

    // Hardcoded steps data
    const hardcodedSteps = [
      {
        id: 1,
        course_id: 1,
        title: "Uvod u React.js",
        description:
          "U ovoj lekciji ćemo se upoznati sa React.js bibliotekom, njenim osnovnim konceptima i zašto je toliko popularna u web developmentu. Naučićete šta je React, kako funkcioniše i zašto ga koriste najveće kompanije poput Facebook-a, Netflix-a i Airbnb-a.",
        video_url: "https://www.youtube.com/embed/dGcsHMXbSOA",
        image_url: "/placeholder.svg?height=400&width=600",
      },
      {
        id: 2,
        course_id: 1,
        title: "Instalacija i Setup",
        description:
          "Korak po korak vodič za instalaciju Node.js-a, npm-a i kreiranje prvog React projekta. Naučićete kako da postavite development environment i koje alate su vam potrebni za React development.",
        video_url: "https://www.youtube.com/embed/SqcY0GlETPk",
        image_url: "/placeholder.svg?height=400&width=600",
      },
      {
        id: 3,
        course_id: 1,
        title: "JSX Sintaksa",
        description:
          "Duboko zavirite u JSX sintaksu - React-ov način pisanja HTML-a u JavaScript-u. Naučićete pravila JSX-a, kako da koristite JavaScript izraze u JSX-u i najbolje prakse za pisanje čistog koda.",
        video_url: "https://www.youtube.com/embed/7fPXI_MnBOY",
        image_url: "/placeholder.svg?height=400&width=600",
      },
      {
        id: 4,
        course_id: 1,
        title: "Komponente i Props",
        description:
          "Naučite kako da kreirate i koristite React komponente. Razumećete razliku između funkcionalnih i klasnih komponenti, kako da prosljeđujete podatke kroz props i kako da organizujete svoj kod u modularne komponente.",
        video_url: "https://www.youtube.com/embed/9D1x7-2FmTA",
        image_url: "/placeholder.svg?height=400&width=600",
      },
      {
        id: 5,
        course_id: 1,
        title: "State i Event Handling",
        description:
          "Ovladajte React State-om i event handling-om. Naučićete kako da upravljate stanjem komponenti, kako da reagujete na korisničke akcije i kako da kreirate interaktivne aplikacije.",
        video_url: "https://www.youtube.com/embed/4pO-HcG2igk",
        image_url: "/placeholder.svg?height=400&width=600",
      },
      {
        id: 6,
        course_id: 1,
        title: "React Hooks - useState i useEffect",
        description:
          "Detaljno objašnjenje najvažnijih React Hook-ova. Naučićete kako da koristite useState za upravljanje stanjem i useEffect za side effects u funkcionalnim komponentama.",
        video_url: "https://www.youtube.com/embed/O6P86uwfdR0",
        image_url: "/placeholder.svg?height=400&width=600",
      },
      {
        id: 7,
        course_id: 1,
        title: "Conditional Rendering i Lists",
        description:
          "Naučite kako da prikazujete sadržaj uslovno i kako da renderujete liste podataka. Pokrićemo različite tehnike za conditional rendering i najbolje prakse za rad sa listama u React-u.",
        video_url: "https://www.youtube.com/embed/7o5FPaVA9m0",
        image_url: "/placeholder.svg?height=400&width=600",
      },
      {
        id: 8,
        course_id: 1,
        title: "Forms i Input Handling",
        description:
          "Kompletan vodič za rad sa formama u React-u. Naučićete kako da kreirate kontrolisane komponente, kako da validirate input podatke i kako da upravljate složenim formama.",
        video_url: "https://www.youtube.com/embed/IkMND33x0qQ",
        image_url: "/placeholder.svg?height=400&width=600",
      },
      {
        id: 9,
        course_id: 1,
        title: "React Router",
        description:
          "Naučite kako da implementirate navigaciju u React aplikacijama koristeći React Router. Pokrićemo osnovne rute, parametrizovane rute, nested routing i programsku navigaciju.",
        video_url: "https://www.youtube.com/embed/Law7wfdg_ls",
        image_url: "/placeholder.svg?height=400&width=600",
      },
      {
        id: 10,
        course_id: 1,
        title: "Finalni Projekat - Todo App",
        description:
          "Primijenite sve naučeno u praktičnom projektu. Kreirat ćemo kompletnu Todo aplikaciju sa dodavanjem, brisanjem, editovanjem i filtriranjem zadataka. Ovo je prilika da pokažete sve svoje React vještine!",
        video_url: "https://www.youtube.com/embed/hQAHSlTtcmY",
        image_url: "/placeholder.svg?height=400&width=600",
      },
    ]

    setCourse(hardcodedCourse)
    setSteps(hardcodedSteps)

    if (hardcodedSteps.length > 0) {
      setSelectedStep(hardcodedSteps[0])
    }

    setLoading(false)
  }, [])

  const handleStepClick = (step) => {
    setSelectedStep(step)
  }

  const markStepCompleted = (stepId) => {
    setCompletedSteps((prev) => new Set([...prev, stepId]))
  }

  if (loading) {
    return (
      <Box className={styles.loadingContainer}>
        <Typography variant="h6">Učitavanje kursa...</Typography>
      </Box>
    )
  }

  if (!course) {
    return (
      <Box className={styles.errorContainer}>
        <Typography variant="h6" color="error">
          Kurs nije pronađen
        </Typography>
      </Box>
    )
  }

  return (
    <Box className={styles.courseContainer}>
      {/* Course Header */}
      <Box className={styles.courseHeader}>
        <Container maxWidth="xl">
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h3" className={styles.courseTitle}>
                {course.title}
              </Typography>
              <Typography variant="h6" className={styles.courseDescription}>
                {course.description}
              </Typography>
              <Box className={styles.courseMeta}>
                <Chip icon={<School />} label={course.category} className={styles.categoryChip} />
                <Chip icon={<AccessTime />} label={`${steps.length} lekcija`} className={styles.lessonsChip} />
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card className={styles.courseImageCard}>
                <CardMedia
                  component="img"
                  height="200"
                  image={normalizePath(course.image_thumbnail)}
                  alt={course.title}
                />
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="xl" className={styles.mainContent}>
        <Grid container spacing={3}>
          {/* Steps Sidebar */}
          <Grid item xs={12} md={4} lg={3}>
            <Paper className={styles.stepsSidebar}>
              <Typography variant="h6" className={styles.sidebarTitle}>
                Sadržaj kursa
              </Typography>
              <Divider className={styles.divider} />
              <List className={styles.stepsList}>
                {steps.map((step, index) => (
                  <ListItem key={step.id} disablePadding>
                    <ListItemButton
                      onClick={() => handleStepClick(step)}
                      className={`${styles.stepItem} ${selectedStep?.id === step.id ? styles.activeStep : ""}`}
                    >
                      <Box className={styles.stepIcon}>
                        {completedSteps.has(step.id) ? (
                          <CheckCircle className={styles.completedIcon} />
                        ) : (
                          <RadioButtonUnchecked className={styles.uncompletedIcon} />
                        )}
                      </Box>
                      <ListItemText
                        primary={
                          <Typography className={styles.stepTitle}>
                            {index + 1}. {step.title}
                          </Typography>
                        }
                        secondary={<Typography className={styles.stepNumber}>Lekcija {index + 1}</Typography>}
                      />
                      {step.video_url && <PlayCircleOutline className={styles.videoIcon} />}
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Step Content */}
          <Grid item xs={12} md={8} lg={9}>
            {selectedStep ? (
              <Paper className={styles.stepContent}>
                <Box className={styles.stepHeader}>
                  <Typography variant="h4" className={styles.stepContentTitle}>
                    {selectedStep.title}
                  </Typography>
                  <Typography variant="body1" className={styles.stepContentDescription}>
                    {selectedStep.description}
                  </Typography>
                </Box>

                {selectedStep.video_url && (
                  <Box className={styles.videoContainer}>
                    <Box className={styles.videoWrapper}>
                      <iframe
                        src={normalizePath(selectedStep.video_url)}
                        title={selectedStep.title}
                        frameBorder="0"
                        allowFullScreen
                        className={styles.videoFrame}
                      />
                    </Box>
                  </Box>
                )}

                {selectedStep.image_url && (
                  <Box className={styles.imageContainer}>
                    <img
                      src={normalizePath(selectedStep.image_url) || "/placeholder.svg"}
                      alt={selectedStep.title}
                      className={styles.stepImage}
                    />
                  </Box>
                )}

                <Box className={styles.stepActions}>
                  {!completedSteps.has(selectedStep.id) && (
                    <button onClick={() => markStepCompleted(selectedStep.id)} className={styles.completeButton}>
                      Označi kao završeno
                    </button>
                  )}
                </Box>
              </Paper>
            ) : (
              <Paper className={styles.noStepSelected}>
                <Typography variant="h6" color="text.secondary">
                  Odaberite lekciju sa lijeve strane
                </Typography>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
