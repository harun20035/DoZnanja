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
  Modal,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Snackbar,
} from "@mui/material"
import { CheckCircle, RadioButtonUnchecked, School, AccessTime, PlayCircleOutline, Image } from "@mui/icons-material"
import Rating from '@mui/material/Rating';
import { format } from 'date-fns';

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
  const [quizModalOpen, setQuizModalOpen] = useState(false)
  const [quiz, setQuiz] = useState(null)
  const [quizQuestions, setQuizQuestions] = useState([])
  const [quizAnswers, setQuizAnswers] = useState({})
  const [quizResult, setQuizResult] = useState(null)
  const [quizLoading, setQuizLoading] = useState(false)
  const [showReview, setShowReview] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', success: false })
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const REVIEWS_PER_PAGE = 5;

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
  const saveToLocalStorage = (stepId, userId) => {
    try {
      const key = `course_progress_${userId}_${courseId}`
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
  const loadFromLocalStorage = (userId) => {
    try {
      const key = `course_progress_${userId}_${courseId}`
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
      const userData = JSON.parse(localStorage.getItem("user_data") || "{}")
      const userId = userData.id
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
        if (userId) {
          // Prvo pokušaj da učitamo sa backend-a
          const backendProgress = await fetchCompletedSteps(userId)
          if (backendProgress.size > 0) {
            setCompletedSteps(backendProgress)
          } else {
            // Ako nema podataka na backend-u, učitaj iz localStorage
            const localProgress = loadFromLocalStorage(userId)
            setCompletedSteps(localProgress)
          }
        } else {
          // Ako nema user ID, koristi samo localStorage
          const localProgress = loadFromLocalStorage('guest')
          setCompletedSteps(localProgress)
        }

      } catch (err) {
        setError(`Greška: ${err.message}`)
        // U slučaju greške, učitaj iz localStorage
        const userData = JSON.parse(localStorage.getItem("user_data") || "{}")
        const userId = userData.id || 'guest'
        const localProgress = loadFromLocalStorage(userId)
        setCompletedSteps(localProgress)
      } finally {
        setLoading(false)
      }
    }

    if (courseId) fetchCourseData()
  }, [courseId])

  // Provera da li je korisnik već položio kviz
  useEffect(() => {
    const checkQuizResult = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        const res = await fetch(`${API_BASE_URL}/quiz/result/by-course/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!res.ok) return
        const data = await res.json()
        if (data.exists && data.passed) {
          setShowReview(true)
        } else {
          setShowReview(false)
        }
      } catch (err) {
        setShowReview(false)
      }
    }
    if (courseId) checkQuizResult()
  }, [courseId])

  const markStepCompleted = async (stepId) => {
    const userData = JSON.parse(localStorage.getItem("user_data") || "{}")
    const userId = userData.id || 'guest'
    // Dodaj u lokalno stanje odmah
    setCompletedSteps((prev) => new Set([...prev, stepId]))
    
    // Sačuvaj u localStorage kao fallback
    saveToLocalStorage(stepId, userId)
    
    // Pokušaj da sačuvaš na backend
    const backendSuccess = await saveStepProgress(stepId)
    
    if (!backendSuccess) {
      console.warn("Napretak nije sačuvan na backend-u, ali je sačuvan lokalno")
    }
  }

  const handleStepClick = (step) => {
    setSelectedStep(step)
  }

  // Fetch quiz and questions
  const fetchQuizAndQuestions = async () => {
    setQuizLoading(true)
    try {
      const token = localStorage.getItem('auth_token')
      // 1. Fetch quiz for this course
      const quizRes = await fetch(`${API_BASE_URL}/quiz/by-course/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!quizRes.ok) throw new Error('Kviz nije pronađen za ovaj kurs.')
      const quizData = await quizRes.json()
      setQuiz(quizData)
      // 2. Fetch questions for this quiz
      const questionsRes = await fetch(`${API_BASE_URL}/quiz/questions/${quizData.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!questionsRes.ok) throw new Error('Pitanja nisu pronađena.')
      const questionsData = await questionsRes.json()
      setQuizQuestions(questionsData)
      setQuizAnswers({})
      setQuizResult(null)
    } catch (err) {
      setSnackbar({ open: true, message: err.message, success: false })
    } finally {
      setQuizLoading(false)
    }
  }

  // Otvori modal i fetchuj kviz
  const handleOpenQuizModal = () => {
    setQuizModalOpen(true)
    fetchQuizAndQuestions()
  }
  const handleCloseQuizModal = () => {
    setQuizModalOpen(false)
    setQuizResult(null)
    setQuizAnswers({})
  }

  // Selektovanje odgovora
  const handleAnswerChange = (questionId, optionId) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: optionId }))
  }

  // Submit kviza
  const handleQuizSubmit = async () => {
    // Provera da li su sva pitanja odgovorena
    if (quizQuestions.some(q => !quizAnswers[q.id])) {
      setSnackbar({ open: true, message: 'Odgovorite na sva pitanja!', success: false })
      return
    }
    try {
      const token = localStorage.getItem('auth_token')
      const userData = JSON.parse(localStorage.getItem('user_data') || '{}')
      // Pripremi payload
      const payload = quizQuestions.map(q => ({
        course_id: courseId,
        user_id: userData.id,
        question_id: q.id,
        answer_given: quizAnswers[q.id]
      }))
      // Pretpostavljam da postoji endpoint /quiz/answer/bulk za slanje svih odgovora odjednom
      const res = await fetch(`${API_BASE_URL}/quiz/answer/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error('Greška pri slanju odgovora.')
      const result = await res.json()
      setQuizResult(result)
      setSnackbar({ open: true, message: result.passed ? 'Čestitamo, položili ste kviz!' : 'Nažalost, niste položili kviz.', success: result.passed })
      setShowReview(true)
    } catch (err) {
      setSnackbar({ open: true, message: err.message, success: false })
    }
  }

  // Fetch recenzije
  const fetchReviews = async (page = 1) => {
    setReviewsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/course/reviews/by-course/${courseId}?skip=${(page-1)*REVIEWS_PER_PAGE}&limit=${REVIEWS_PER_PAGE}`);
      if (!res.ok) throw new Error('Greška pri učitavanju recenzija.');
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) fetchReviews(reviewPage);
    // eslint-disable-next-line
  }, [courseId, reviewPage]);

  // Nakon slanja recenzije refresuj listu
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewSubmitting(true);
    try {
      const token = localStorage.getItem("auth_token");
      const userData = JSON.parse(localStorage.getItem("user_data") || "{}")
      const res = await fetch(`${API_BASE_URL}/course/reviews/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating: reviewRating,
          comment: reviewComment,
          course_id: parseInt(courseId),
        }),
      });
      if (!res.ok) throw new Error("Greška pri slanju recenzije.");
      setSnackbar({ open: true, message: "Recenzija uspješno sačuvana!", success: true });
      setReviewModalOpen(false);
      setReviewComment("");
      setReviewRating(5);
      fetchReviews(1); // Refresuj na prvu stranicu
      setReviewPage(1);
    } catch (err) {
      setSnackbar({ open: true, message: err.message, success: false });
    } finally {
      setReviewSubmitting(false);
    }
  };

  // Ako korisnik nije upisan na kurs, prikaži poruku i zabrani pristup
  if (courseData && courseData.is_enrolled === false) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #f8f4ff 0%, #ffffff 100%)" }}>
        <Container maxWidth="sm">
          <Alert severity="error" sx={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
            Nemate pristup ovom kursu. Kupite kurs da biste mogli da učite.
          </Alert>
          <Box sx={{ textAlign: "center", marginTop: "1rem" }}>
            <Button variant="contained" onClick={() => router.push("/user/dashboard")} sx={{ background: "#8b5cf6" }}>
              Nazad na dashboard
            </Button>
          </Box>
        </Container>
      </Box>
    )
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
        
        {/* Dugme za kviz ili recenziju */}
        {completedSteps.size === steps.length && !showReview && (
          <Box sx={{ textAlign: "center", marginTop: "2rem" }}>
            <Button variant="contained" sx={{ backgroundColor: "#10b981" }} onClick={handleOpenQuizModal}>
              Radi kviz
            </Button>
          </Box>
        )}
        {showReview && (
          <Box sx={{ textAlign: "center", marginTop: "2rem" }}>
            <Button variant="contained" sx={{ backgroundColor: "#8b5cf6" }} onClick={() => setReviewModalOpen(true)}>
              Ostavi recenziju
            </Button>
          </Box>
        )}
        {/* Prikaz recenzija */}
        <Box sx={{ maxWidth: 600, margin: '2rem auto 0 auto', textAlign: 'center' }}>
          <Typography variant="h5" sx={{ mb: 2 }}>Recenzije</Typography>
          {reviewsLoading ? (
            <Typography>Učitavanje recenzija...</Typography>
          ) : reviews.length === 0 ? (
            <Typography>Nema recenzija za ovaj kurs.</Typography>
          ) : (
            <>
              {reviews.map((r) => (
                <Box key={r.id} sx={{ border: '1px solid #eee', borderRadius: 2, p: 2, mb: 2, textAlign: 'left' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography sx={{ fontWeight: 600 }}>{r.username || 'Korisnik'}</Typography>
                    <Rating value={r.rating} readOnly size="small" max={5} precision={0.5} />
                    <Typography sx={{ color: '#888', fontSize: 13 }}>{format(new Date(r.created_at), 'dd.MM.yyyy.')}</Typography>
                  </Box>
                  <Typography sx={{ fontSize: 15 }}>{r.comment}</Typography>
                </Box>
              ))}
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                <Button variant="outlined" size="small" disabled={reviewPage === 1} onClick={() => setReviewPage(p => Math.max(1, p-1))}>Prethodna</Button>
                <Button variant="outlined" size="small" disabled={reviews.length < REVIEWS_PER_PAGE} onClick={() => setReviewPage(p => p+1)}>Sledeća</Button>
              </Box>
            </>
          )}
        </Box>
      </Container>

      {/* Kviz modal */}
      <Modal open={quizModalOpen} onClose={handleCloseQuizModal}>
        <Box sx={{
          maxWidth: 600,
          maxHeight: '80vh',
          margin: '5% auto',
          background: 'white',
          borderRadius: 4,
          p: 4,
          boxShadow: 24,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Typography variant="h5" sx={{ mb: 2 }}>Kviz za kurs</Typography>
          {quizLoading ? (
            <Typography>Učitavanje kviza...</Typography>
          ) : quizQuestions.length > 0 ? (
            <form onSubmit={e => { e.preventDefault(); handleQuizSubmit(); }}>
              {quizQuestions.map((q, idx) => (
                <FormControl key={q.id} component="fieldset" sx={{ mb: 3, width: '100%' }}>
                  <FormLabel component="legend">{idx + 1}. {q.question_text}</FormLabel>
                  <RadioGroup
                    value={quizAnswers[q.id] || ''}
                    onChange={e => handleAnswerChange(q.id, e.target.value)}
                  >
                    {q.options.map(opt => (
                      <FormControlLabel
                        key={opt.id}
                        value={opt.id}
                        control={<Radio />}
                        label={opt.text}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              ))}
              <Button type="submit" variant="contained" sx={{ mt: 2, backgroundColor: '#10b981' }}>
                Pošalji odgovore
              </Button>
            </form>
          ) : (
            <Typography>Nema dostupnih pitanja za ovaj kviz.</Typography>
          )}
          {quizResult && (
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="h6" color={quizResult.passed ? 'success.main' : 'error.main'}>
                {quizResult.passed ? 'Čestitamo, položili ste kviz!' : 'Nažalost, niste položili kviz.'}
              </Typography>
              {quizResult.score !== undefined && (
                <Typography sx={{ mt: 1 }}>Rezultat: {quizResult.score} / {quizQuestions.length}</Typography>
              )}
              <Button sx={{ mt: 2 }} onClick={handleCloseQuizModal}>Zatvori</Button>
            </Box>
          )}
        </Box>
      </Modal>
      {/* Review modal */}
      <Modal open={reviewModalOpen} onClose={() => setReviewModalOpen(false)}>
        <Box sx={{
          maxWidth: 400,
          margin: '10% auto',
          background: 'white',
          borderRadius: 4,
          p: 4,
          boxShadow: 24,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Ostavi recenziju</Typography>
          <form onSubmit={handleReviewSubmit} style={{ width: '100%' }}>
            <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Rating
                name="review-rating"
                value={reviewRating}
                onChange={(_, newValue) => setReviewRating(newValue)}
                precision={1}
                size="large"
                max={5}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <textarea
                value={reviewComment}
                onChange={e => setReviewComment(e.target.value)}
                placeholder="Vaš komentar (opcionalno)"
                rows={4}
                style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc', resize: 'vertical' }}
              />
            </Box>
            <Button type="submit" variant="contained" sx={{ backgroundColor: '#8b5cf6', width: '100%' }} disabled={reviewSubmitting}>
              {reviewSubmitting ? 'Spremanje...' : 'Spasi recenziju'}
            </Button>
          </form>
        </Box>
      </Modal>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
    </Box>
  )
}
