"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
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
  const router = useRouter()
  const courseId = params.id

  const [courseData, setCourseData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedStep, setSelectedStep] = useState(null)
  const [completedSteps, setCompletedSteps] = useState(new Set())
  const [savingProgress, setSavingProgress] = useState(false)

  // Funkcija za učitavanje završenih koraka sa backend-a
  const fetchCompletedSteps = async (userId) => {
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`${API_BASE_URL}/progress/completed/${userId}/${courseId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const completedStepIds = await response.json()
        return new Set(completedStepIds)
      }
    } catch (err) {
      console.error("Greška pri učitavanju napretka:", err)
    }
    return new Set()
  }

  // Funkcija za čuvanje završenog koraka na backend
  const saveStepProgress = async (stepId) => {
    try {
      setSavingProgress(true)
      const token = localStorage.getItem("auth_token")
      const userData = JSON.parse(localStorage.getItem("user_data") || "{}")
      const userId = userData.id

      if (!userId) {
        console.error("User ID nije pronađen")
        return false
      }

      const response = await fetch(`${API_BASE_URL}/progress/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userId,
          course_id: parseInt(courseId),
          step_id: stepId,
          completed: true
        }),
      })

      if (response.ok) {
        return true
      } else {
        console.error("Greška pri čuvanju napretka:", response.statusText)
        return false
      }
    } catch (err) {
      console.error("Greška pri čuvanju napretka:", err)
      return false
    } finally {
      setSavingProgress(false)
    }
  }

  // Funkcija za čuvanje u localStorage kao fallback
  const saveToLocalStorage = (stepId) => {
    try {
      const key = `course_progress_${courseId}`
      const existingProgress = JSON.parse(localStorage.getItem(key) || "[]")
      if (!existingProgress.includes(stepId)) {
        existingProgress.push(stepId)
        localStorage.setItem(key, JSON.stringify(existingProgress))
      }
    } catch (err) {
      console.error("Greška pri čuvanju u localStorage:", err)
    }
  }

  // Funkcija za učitavanje iz localStorage kao fallback
  const loadFromLocalStorage = () => {
    try {
      const key = `course_progress_${courseId}`
      const progress = JSON.parse(localStorage.getItem(key) || "[]")
      return new Set(progress)
    } catch (err) {
      console.error("Greška pri učitavanju iz localStorage:", err)
      return new Set()
    }
  }

  // Učitavanje podataka o kursu i napretku
  useEffect(() => {
    const fetchCourseData = async () => {
      const token = localStorage.getItem("auth_token")
      console.log("📦 Token:", token)

      if (!token) {
        setError("Niste prijavljeni.")
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`${API_BASE_URL}/course/view/${courseId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          const text = await response.text()
          throw new Error(`HTTP error! status: ${response.status} - ${text}`)
        }

        if (response.status === 403) {
          alert("Nemate pristup ovom kursu.");
          router.push("/user/dashboard");
          return;
        }

        const data = await response.json()
        setCourseData(data)
        if (data.steps.length > 0) setSelectedStep(data.steps[0])

        // Učitavanje napretka
        const userData = JSON.parse(localStorage.getItem("user_data") || "{}")
        const userId = userData.id

        if (userId) {
          // Prvo pokušaj da učitamo sa backend-a
          const backendProgress = await fetchCompletedSteps(userId)
          if (backendProgress.size > 0) {
            setCompletedSteps(backendProgress)
          } else {
            // Ako nema podataka na backend-u, učitaj iz localStorage
            const localProgress = loadFromLocalStorage()
            setCompletedSteps(localProgress)
          }
        } else {
          // Ako nema user ID, koristi samo localStorage
          const localProgress = loadFromLocalStorage()
          setCompletedSteps(localProgress)
        }

      } catch (err) {
        setError(`Greška: ${err.message}`)
        // U slučaju greške, učitaj iz localStorage
        const localProgress = loadFromLocalStorage()
        setCompletedSteps(localProgress)
      } finally {
        setLoading(false)
      }
    }

    if (courseId) fetchCourseData()
  }, [courseId])

  const markStepCompleted = async (stepId) => {
    // Dodaj u lokalno stanje odmah
    setCompletedSteps((prev) => new Set([...prev, stepId]))
    
    // Sačuvaj u localStorage kao fallback
    saveToLocalStorage(stepId)
    
    // Pokušaj da sačuvaš na backend
    const backendSuccess = await saveStepProgress(stepId)
    
    if (!backendSuccess) {
      console.warn("Napretak nije sačuvan na backend-u, ali je sačuvan lokalno")
    }
  }

  const handleStepClick = (step) => {
    setSelectedStep(step)
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

                {/* Video Content */}
                {selectedStep.video_url && (
                  <Box sx={{ padding: "2rem", background: "white" }}>
                    <Box sx={{ position: "relative", paddingTop: "56.25%", borderRadius: "8px", overflow: "hidden", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}>
                      {selectedStep.video_url.includes('youtube.com') || selectedStep.video_url.includes('youtu.be') ? (
                        // YouTube video
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
                          }}
                        />
                      ) : (
                        // Local video file
                        <video
                          controls
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                          }}
                        >
                          <source 
                            src={`${API_BASE_URL}/${selectedStep.video_url.replace(/\\/g, '/')}`} 
                            type="video/mp4" 
                          />
                          Vaš browser ne podržava video tag.
                        </video>
                      )}
                    </Box>
                  </Box>
                )}

                {/* Image Content */}
                {selectedStep.image_url && (
                  <Box sx={{ padding: "2rem", background: "white", textAlign: "center" }}>
                    <img
                      src={`${API_BASE_URL}/${selectedStep.image_url.replace(/\\/g, '/')}`}
                      alt={selectedStep.title}
                      style={{
                        maxWidth: "100%",
                        height: "auto",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                  </Box>
                )}

                {/* Step Actions */}
                <Box sx={{ padding: "2rem", background: "white", borderTop: "1px solid rgba(139, 92, 246, 0.1)" }}>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#8b5cf6",
                      "&:hover": { backgroundColor: "#7c3aed" },
                    }}
                    disabled={completedSteps.has(selectedStep?.id) || savingProgress || !selectedStep}
                    onClick={async () => {
                      if (!selectedStep) return
                      
                      await markStepCompleted(selectedStep.id)

                      // Otključavanje sljedećeg koraka
                      const currentIndex = steps.findIndex(s => s.id === selectedStep.id)
                      const nextStep = steps[currentIndex + 1]
                      if (nextStep) setSelectedStep(nextStep)
                    }}
                  >
                    {savingProgress ? "Čuvanje..." : completedSteps.has(selectedStep?.id) ? "Završeno" : "Označi kao završeno"}
                  </Button>
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
        
        {completedSteps.size === steps.length && (
          <Box sx={{ textAlign: "center", marginTop: "2rem" }}>
            <Button variant="contained" sx={{ backgroundColor: "#10b981" }}>
              Radi kviz
            </Button>
          </Box>
        )}

      </Container>
    </Box>
  )
}
