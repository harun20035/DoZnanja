"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
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
  CircularProgress,
  Alert,
} from "@mui/material"
import { CheckCircle, RadioButtonUnchecked, School, AccessTime, PlayCircleOutline, Image } from "@mui/icons-material"

// Konfiguracija API URL-a
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export default function CourseViewerPage() {
  const params = useParams()
  const courseId = params.id

  const [courseData, setCourseData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedStep, setSelectedStep] = useState(null)
  const [completedSteps, setCompletedSteps] = useState(new Set())

  // Učitavanje podataka o kursu
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log("🔍 Fetching course data...")
        console.log("📍 API_BASE_URL:", API_BASE_URL)
        console.log("🆔 Course ID:", courseId)

        const url = `http://localhost:8000/course/view/${id}`; // umjesto /courses/

        console.log("🌐 Full URL:", url)

        const token = localStorage.getItem("access_token")
        console.log("🔑 Token exists:", !!token)

        const headers = {
          "Content-Type": "application/json",
        }

        if (token) {
          headers["Authorization"] = `Bearer ${token}`
        }

        console.log("📤 Request headers:", headers)

        const response = await fetch(url, {
          method: "GET",
          headers,
        })

        console.log("📥 Response status:", response.status)
        console.log("📥 Response ok:", response.ok)

        if (!response.ok) {
          const errorText = await response.text()
          console.error("❌ Error response:", errorText)
          throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
        }

        const data = await response.json()
        console.log("✅ Course data received:", data)

        setCourseData(data)

        // Postavi prvi step kao selektovan
        if (data.steps && data.steps.length > 0) {
          setSelectedStep(data.steps[0])
          console.log("📝 First step selected:", data.steps[0].title)
        }
      } catch (err) {
        console.error("💥 Error fetching course data:", err)
        setError(`Greška pri učitavanju kursa: ${err.message}`)
      } finally {
        setLoading(false)
      }
    }

    if (courseId) {
      fetchCourseData()
    }
  }, [courseId])

  const handleStepClick = (step) => {
    setSelectedStep(step)
  }

  const markStepCompleted = (stepId) => {
    setCompletedSteps((prev) => new Set([...prev, stepId]))
  }

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f8f4ff 0%, #ffffff 100%)",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress size={60} sx={{ color: "#8b5cf6", marginBottom: "1rem" }} />
          <Typography variant="h6" sx={{ color: "#8b5cf6" }}>
            Učitavanje kursa...
          </Typography>
          <Typography variant="body2" sx={{ color: "#666", marginTop: "0.5rem" }}>
            API: {API_BASE_URL}/courses/view/{courseId}
          </Typography>
        </Box>
      </Box>
    )
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f8f4ff 0%, #ffffff 100%)",
        }}
      >
        <Container maxWidth="md">
          <Alert severity="error" sx={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
            {error}
          </Alert>
          <Paper sx={{ padding: "1rem", backgroundColor: "#f5f5f5" }}>
            <Typography variant="h6" sx={{ marginBottom: "1rem" }}>
              Debug informacije:
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
              API URL: {API_BASE_URL}/courses/view/{courseId}
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
              Course ID: {courseId}
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
              Environment: {process.env.NODE_ENV}
            </Typography>
          </Paper>
          <Box sx={{ textAlign: "center", marginTop: "1rem" }}>
            <Button variant="contained" onClick={() => window.location.reload()} sx={{ background: "#8b5cf6" }}>
              Pokušaj ponovo
            </Button>
          </Box>
        </Container>
      </Box>
    )
  }

  if (!courseData) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f8f4ff 0%, #ffffff 100%)",
        }}
      >
        <Container maxWidth="md">
          <Alert severity="warning" sx={{ fontSize: "1.1rem" }}>
            Kurs nije pronađen.
          </Alert>
        </Container>
      </Box>
    )
  }

  const { course, creator, steps, is_enrolled, total_steps } = courseData

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
              DoZnanja
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
              Profil
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
              <Typography variant="h6" sx={{ opacity: 0.95, marginBottom: "1rem", lineHeight: 1.6 }}>
                {course.description}
              </Typography>

              {creator && (
                <Typography variant="body1" sx={{ opacity: 0.9, marginBottom: "1.5rem" }}>
                  Kreator: {creator.name} {creator.surname} (@{creator.username})
                </Typography>
              )}

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
                  label={`${total_steps} lekcija`}
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                    color: "white",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                  }}
                />
                {is_enrolled && (
                  <Chip
                    icon={<CheckCircle />}
                    label="Enrollovan"
                    sx={{
                      backgroundColor: "rgba(16, 185, 129, 0.2)",
                      color: "white",
                      border: "1px solid rgba(16, 185, 129, 0.3)",
                    }}
                  />
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ borderRadius: "12px", overflow: "hidden", boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)" }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={
                    course.image_thumbnail
                      ? `${API_BASE_URL}/${course.image_thumbnail}`
                      : "/placeholder.svg?height=300&width=400"
                  }
                  alt={course.title}
                />
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Main Content - ostatak koda ostaje isti */}
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

          {/* Step Content - ostatak komponente */}
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
    </Box>
  )
}
