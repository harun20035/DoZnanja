// app/creator/[course_id]/quiz/page.js
"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import "./page.css"

export default function QuizCreationPage() {
  const { course_id } = useParams()

  const [questions, setQuestions] = useState(
    Array.from({ length: 5 }, () => ({
      question: "",
      options: ["", "", "", ""],
      correctIndex: null,
    }))
  )

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

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Kviz za kurs:", course_id)
    console.log("Pitanja:", questions)
    // TODO: Pošalji podatke backendu
  }

  return (
    <div className="quiz-container">
      <h2>Kreiraj kviz za kurs #{course_id}</h2>
      <form onSubmit={handleSubmit}>
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="question-block">
            <label> Pitanje {qIndex + 1}:</label>
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
        <button type="submit">Spremi kviz</button>
      </form>
    </div>
  )
}
