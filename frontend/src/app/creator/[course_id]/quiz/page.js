"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import "./page.css"
import Snackbar from '@mui/material/Snackbar';

export default function QuizCreationPage() {
  const { course_id } = useParams()
  const router = useRouter()
  const [quizId, setQuizId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [quizCreated, setQuizCreated] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");

  // Role check logic
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const [questions, setQuestions] = useState(
    Array.from({ length: 5 }, () => ({
      question: "",
      options: ["", "", "", ""],
      correctIndex: null,
    }))
  )

  const showSnackbar = (msg) => {
    setSnackbarMsg(msg);
    setSnackbarOpen(true);
  };

  useEffect(() => {
    const checkRole = async () => {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        router.push('/login')
        return
      }
      try {
        const res = await fetch('http://localhost:8000/api/me', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) {
          router.push('/login')
          return
        }
        const data = await res.json()
        if (data.role === 'CREATOR' || data.role === 'ADMIN') {
          setIsAuthorized(true)
        } else {
          router.push('/unauthorized')
        }
      } catch {
        router.push('/unauthorized')
      } finally {
        setIsLoading(false)
      }
    }
    checkRole()
  }, [router])

  useEffect(() => {
    const checkAndCreateQuiz = async () => {
      const token = localStorage.getItem("auth_token")
      try {
        // Prvo proveri da li već postoji kviz za ovaj kurs
        const checkRes = await fetch(`http://localhost:8000/quiz/by-course/${course_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (checkRes.ok) {
          const existingQuiz = await checkRes.json()
          setQuizId(existingQuiz.id)
          setQuizCreated(true)
          setLoading(false)
          return
        }

        // Ako ne postoji, kreiraj novi kviz
        const createRes = await fetch("http://localhost:8000/quiz/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            course_id: parseInt(course_id),
            title: "Kviz za kurs " + course_id,
            description: "Automatski generisan kviz.",
          }),
        })

        const data = await createRes.json()
        if (!createRes.ok) throw new Error(data.detail || "Greška pri kreiranju kviza.")
        setQuizId(data.quiz_id)
        setQuizCreated(true)
      } catch (err) {
        showSnackbar("Greška: " + err.message)
      } finally {
        setLoading(false)
      }
    }

    if (!quizCreated) {
      checkAndCreateQuiz()
    }
  }, [course_id, quizCreated])

  const handleQuestionChange = (index, value) => {
    const updated = [...questions]
    updated[index].question = value
    setQuestions(updated)
  }

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...questions]
    updated[qIndex].options[oIndex] = value
    setQuestions(updated)
  }

  const handleCorrectChange = (qIndex, oIndex) => {
    const updated = [...questions]
    updated[qIndex].correctIndex = oIndex
    setQuestions(updated)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    const token = localStorage.getItem("auth_token")
    if (!token) {
      showSnackbar("Niste prijavljeni.")
      setSubmitting(false)
      return
    }

    if (!quizId) {
      showSnackbar("Nije pronađen validan ID kviza.")
      setSubmitting(false)
      return
    }

    try {
      for (const q of questions) {
        const payload = {
          quiz_id: quizId,
          question_text: q.question,
          options: q.options.map((text, index) => ({
            text,
            is_correct: q.correctIndex === index,
          })),
        }

        const res = await fetch("http://localhost:8000/quiz/create-question", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        })

        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.detail || "Greška prilikom slanja pitanja.")
        }
      }

      showSnackbar("Kviz je uspješno spremljen!")
      router.push("/creator")
    } catch (err) {
      showSnackbar("Greška: " + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (isLoading) {
    return <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>
  }
  if (!isAuthorized) return null

  if (loading) return <p>Učitavanje kviza...</p>

  return (
    <div className="quiz-container">
      <h2>Kreiraj kviz za kurs #{course_id}</h2>
      <form onSubmit={handleSubmit}>
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="question-block">
            <label>Pitanje {qIndex + 1}:</label>
            <input
              type="text"
              value={q.question}
              onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
              required
            />
            <div className="options">
              {q.options.map((opt, oIndex) => (
                <div key={oIndex} className="option">
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                    required
                  />
                  <input
                    type="radio"
                    name={`correct-${qIndex}`}
                    checked={q.correctIndex === oIndex}
                    onChange={() => handleCorrectChange(qIndex, oIndex)}
                  />
                  <span>Tačan odgovor</span>
                </div>
              ))}
            </div>
          </div>
        ))}
        <button type="submit" disabled={submitting || !quizId}>{submitting ? "Spremanje..." : "Spremi kviz"}</button>
      </form>
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)} message={snackbarMsg} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} />
    </div>
  )
}
