"use client"

import { useState } from "react"
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
  AppBar,
  Toolbar,
  Button,
} from "@mui/material"
import { CheckCircle, RadioButtonUnchecked, School, AccessTime, PlayCircleOutline, Image } from "@mui/icons-material"

export default function CourseViewerPage() {
  // Hardcoded course data
  const course = {
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

  // Hardcoded steps data - različiti scenariji
  const steps = [
    {
      id: 1,
      course_id: 1,
      title: "Uvod u React.js",
      description:
        "U ovoj lekciji ćemo se upoznati sa React.js bibliotekom, njenim osnovnim konceptima i zašto je toliko popularna u web developmentu. Vidjet ćemo i dijagram arhitekture React aplikacije.",
      video_url: "https://www.youtube.com/embed/dGcsHMXbSOA",
      image_url: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 2,
      course_id: 1,
      title: "Instalacija i Setup",
      description: "Korak po korak vodič za instalaciju Node.js-a, npm-a i kreiranje prvog React projekta.",
      video_url: "https://www.youtube.com/embed/SqcY0GlETPk",
      image_url: null, // Samo video
    },
    {
      id: 3,
      course_id: 1,
      title: "JSX Sintaksa - Dijagram",
      description:
        "Duboko zavirite u JSX sintaksu - React-ov način pisanja HTML-a u JavaScript-u. Ova lekcija sadrži samo dijagram sa objašnjenjem.",
      video_url: null, // Samo slika
      image_url: "/placeholder.svg?height=500&width=800",
    },
    {
      id: 4,
      course_id: 1,
      title: "Komponente i Props - Kompletna lekcija",
      description:
        "Naučite kako da kreirate i koristite React komponente. Ova lekcija sadrži i video objašnjenje i dijagram komponenti.",
      video_url: "https://www.youtube.com/embed/9D1x7-2FmTA",
      image_url: "/placeholder.svg?height=450&width=700",
    },
    {
      id: 5,
      course_id: 1,
      title: "State i Event Handling",
      description: "Ovladajte React State-om i event handling-om. Samo tekstualno objašnjenje bez dodatnih materijala.",
      video_url: null, // Samo tekst
      image_url: null,
    },
  ]

  const [selectedStep, setSelectedStep] = useState(steps[0])
  const [completedSteps, setCompletedSteps] = useState(new Set())

  const handleStepClick = (step) => {
    setSelectedStep(step)
  }

  const markStepCompleted = (stepId) => {
    setCompletedSteps((prev) => new Set([...prev, stepId]))
  }

  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg, #f8f4ff 0%, #ffffff 100%)" }}>
      {/* Navbar */}
      <AppBar
        position="static"
        sx={{
          background: "linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #9333ea 100%)",
          boxShadow: "0 4px 20px rgba(139, 92, 246, 0.3)",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 2rem" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <School sx={{ fontSize: "2rem", color: "white" }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: "white", fontSize: "1.5rem" }}>
              EduPlatform
            </Typography>
          </Box>

          <Box sx={{ display: { xs: "none", md: "flex" }, gap: "1rem" }}>
            <Button color="inherit" sx={{ fontWeight: 500 }}>
              Kursevi
            </Button>
            <Button color="inherit" sx={{ fontWeight: 500 }}>
              Moji Kursevi
            </Button>
            <Button color="inherit" sx={{ fontWeight: 500 }}>
              Korpa
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Course Header */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #9333ea 100%)",
          color: "white",
          padding: "3rem 0",
          marginBottom: "2rem",
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h3" sx={{ fontWeight: 700, marginBottom: "1rem" }}>
                {course.title}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.95, marginBottom: "1.5rem", lineHeight: 1.6 }}>
                {course.description}
              </Typography>
              <Box sx={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <Chip
                  icon={<School />}
                  label={course.category}
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    color: "white",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                  }}
                />
                <Chip
                  icon={<AccessTime />}
                  label={`${steps.length} lekcija`}
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                    color: "white",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ borderRadius: "12px", overflow: "hidden", boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)" }}>
                <CardMedia
                  component="img"
                  height="200"
                  image="/placeholder.svg?height=300&width=400"
                  alt={course.title}
                />
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ paddingBottom: "3rem" }}>
        <Grid container spacing={3}>
          {/* Steps Sidebar */}
          <Grid item xs={12} md={4} lg={3}>
            <Paper
              sx={{
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(139, 92, 246, 0.1)",
                border: "1px solid rgba(139, 92, 246, 0.1)",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  padding: "1.5rem",
                  background: "linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)",
                  color: "white",
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                Sadržaj kursa
              </Typography>
              <Divider sx={{ margin: 0, backgroundColor: "rgba(139, 92, 246, 0.1)" }} />
              <List sx={{ padding: 0 }}>
                {steps.map((step, index) => (
                  <ListItem key={step.id} disablePadding>
                    <ListItemButton
                      onClick={() => handleStepClick(step)}
                      sx={{
                        padding: "1rem 1.5rem",
                        borderBottom: "1px solid rgba(139, 92, 246, 0.05)",
                        transition: "all 0.2s ease",
                        "&:hover": { backgroundColor: "rgba(139, 92, 246, 0.05)" },
                        ...(selectedStep?.id === step.id
                          ? {
                              backgroundColor: "rgba(139, 92, 246, 0.1)",
                              borderLeft: "4px solid #8b5cf6",
                            }
                          : {}),
                      }}
                    >
                      <Box sx={{ marginRight: "1rem", display: "flex", alignItems: "center" }}>
                        {completedSteps.has(step.id) ? (
                          <CheckCircle sx={{ color: "#10b981", fontSize: "1.2rem" }} />
                        ) : (
                          <RadioButtonUnchecked sx={{ color: "#d1d5db", fontSize: "1.2rem" }} />
                        )}
                      </Box>
                      <ListItemText
                        primary={
                          <Typography sx={{ fontWeight: 500, color: "#374151", fontSize: "0.9rem" }}>
                            {index + 1}. {step.title}
                          </Typography>
                        }
                        secondary={
                          <Typography sx={{ fontSize: "0.75rem", color: "#8b5cf6" }}>Lekcija {index + 1}</Typography>
                        }
                      />
                      <Box sx={{ display: "flex", gap: "0.25rem" }}>
                        {step.video_url && <PlayCircleOutline sx={{ color: "#8b5cf6", fontSize: "1.1rem" }} />}
                        {step.image_url && <Image sx={{ color: "#a855f7", fontSize: "1.1rem" }} />}
                      </Box>
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Step Content */}
          <Grid item xs={12} md={8} lg={9}>
            {selectedStep ? (
              <Paper
                sx={{
                  borderRadius: "12px",
                  padding: 0,
                  boxShadow: "0 4px 20px rgba(139, 92, 246, 0.08)",
                  border: "1px solid rgba(139, 92, 246, 0.1)",
                  overflow: "hidden",
                }}
              >
                {/* Step Header */}
                <Box
                  sx={{
                    padding: "2rem",
                    background: "linear-gradient(135deg, #faf7ff 0%, #f3f0ff 100%)",
                    borderBottom: "1px solid rgba(139, 92, 246, 0.1)",
                  }}
                >
                  <Typography variant="h4" sx={{ color: "#8b5cf6", fontWeight: 700, marginBottom: "1rem" }}>
                    {selectedStep.title}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#6b7280", lineHeight: 1.7 }}>
                    {selectedStep.description}
                  </Typography>

                  {/* Content Type Indicators */}
                  <Box sx={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                    {selectedStep.video_url && (
                      <Chip
                        icon={<PlayCircleOutline />}
                        label="Video"
                        size="small"
                        sx={{ backgroundColor: "rgba(139, 92, 246, 0.1)", color: "#8b5cf6" }}
                      />
                    )}
                    {selectedStep.image_url && (
                      <Chip
                        icon={<Image />}
                        label="Dijagram"
                        size="small"
                        sx={{ backgroundColor: "rgba(168, 85, 247, 0.1)", color: "#a855f7" }}
                      />
                    )}
                    {!selectedStep.video_url && !selectedStep.image_url && (
                      <Chip
                        label="Tekstualna lekcija"
                        size="small"
                        sx={{ backgroundColor: "rgba(107, 114, 128, 0.1)", color: "#6b7280" }}
                      />
                    )}
                  </Box>
                </Box>

                {/* Video Content */}
                {selectedStep.video_url && (
                  <Box sx={{ padding: "2rem", background: "white" }}>
                    <Typography variant="h6" sx={{ color: "#8b5cf6", marginBottom: "1rem", fontWeight: 600 }}>
                      📹 Video lekcija
                    </Typography>
                    <Box
                      sx={{
                        position: "relative",
                        paddingTop: "56.25%",
                        borderRadius: "8px",
                        overflow: "hidden",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <iframe
                        src={selectedStep.video_url}
                        title={selectedStep.title}
                        frameBorder="0"
                        allowFullScreen
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          border: "none",
                        }}
                      />
                    </Box>
                  </Box>
                )}

                {/* Image Content */}
                {selectedStep.image_url && (
                  <Box sx={{ padding: "2rem", background: selectedStep.video_url ? "#fafafa" : "white" }}>
                    <Typography variant="h6" sx={{ color: "#a855f7", marginBottom: "1rem", fontWeight: 600 }}>
                      📊 Dijagram i objašnjenje
                    </Typography>
                    <Box
                      sx={{
                        textAlign: "center",
                        padding: "1rem",
                        backgroundColor: "white",
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                      }}
                    >
                      <img
                        src={selectedStep.image_url || "/placeholder.svg"}
                        alt={selectedStep.title}
                        style={{
                          maxWidth: "100%",
                          height: "auto",
                          borderRadius: "8px",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                    </Box>
                  </Box>
                )}

                {/* No Media Content */}
                {!selectedStep.video_url && !selectedStep.image_url && (
                  <Box sx={{ padding: "2rem", background: "white" }}>
                    <Typography variant="h6" sx={{ color: "#6b7280", marginBottom: "1rem", fontWeight: 600 }}>
                      📝 Tekstualna lekcija
                    </Typography>
                    <Box
                      sx={{
                        padding: "1.5rem",
                        backgroundColor: "#f9fafb",
                        borderRadius: "8px",
                        border: "1px solid #e5e7eb",
                      }}
                    >
                      <Typography variant="body1" sx={{ color: "#374151", lineHeight: 1.8 }}>
                        Ova lekcija sadrži detaljno tekstualno objašnjenje koncepata. Pročitajte pažljivo i pratite
                        primjere koda koji će biti prikazani u narednim lekcijama.
                      </Typography>
                    </Box>
                  </Box>
                )}

                {/* Step Actions */}
                <Box
                  sx={{
                    padding: "2rem",
                    background: "white",
                    borderTop: "1px solid rgba(139, 92, 246, 0.1)",
                  }}
                >
                  {!completedSteps.has(selectedStep.id) ? (
                    <Button
                      onClick={() => markStepCompleted(selectedStep.id)}
                      sx={{
                        background: "linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)",
                        color: "white",
                        border: "none",
                        padding: "0.75rem 2rem",
                        borderRadius: "8px",
                        fontWeight: 500,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        boxShadow: "0 2px 8px rgba(139, 92, 246, 0.3)",
                        "&:hover": {
                          transform: "translateY(-1px)",
                          boxShadow: "0 4px 12px rgba(139, 92, 246, 0.4)",
                        },
                      }}
                    >
                      ✓ Označi kao završeno
                    </Button>
                  ) : (
                    <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <CheckCircle sx={{ color: "#10b981", fontSize: "1.5rem" }} />
                      <Typography sx={{ color: "#10b981", fontWeight: 600 }}>Lekcija je završena!</Typography>
                    </Box>
                  )}
                </Box>
              </Paper>
            ) : (
              <Paper
                sx={{
                  borderRadius: "12px",
                  padding: "3rem",
                  textAlign: "center",
                  background: "linear-gradient(135deg, #faf7ff 0%, #f3f0ff 100%)",
                  border: "1px solid rgba(139, 92, 246, 0.1)",
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  Odaberite lekciju sa lijeve strane
                </Typography>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          background: "linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #9333ea 100%)",
          color: "white",
          padding: "3rem 0 1rem",
          marginTop: "4rem",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                <School sx={{ fontSize: "2rem", color: "white" }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: "white" }}>
                  EduPlatform
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{ color: "rgba(255, 255, 255, 0.8)", lineHeight: 1.6, marginBottom: "1rem" }}
              >
                Vaša destinacija za online učenje. Pristupite kvalitetnim kursevima i razvijajte svoje vještine uz
                najbolje instruktore.
              </Typography>
            </Grid>

            <Grid item xs={12} md={8}>
              <Typography variant="h6" sx={{ fontWeight: 600, marginBottom: "1rem", color: "white" }}>
                © 2024 EduPlatform. Sva prava zadržana.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  )
}
