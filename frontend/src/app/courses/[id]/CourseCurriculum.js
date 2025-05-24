"use client"

import { useState } from "react"

export default function CourseCurriculum({ course }) {
  const [openSection, setOpenSection] = useState(1)

  // Mock sections data (replace with actual data from course if available)
  const sections = [
    {
      id: 1,
      title: "Uvod u kurs",
      lessons: [
        { id: 1, title: "Dobrodošli na kurs", duration: "5:20", type: "video" },
        { id: 2, title: "Kako koristiti platformu", duration: "8:15", type: "video" },
        { id: 3, title: "Pregled kursa", duration: "10:30", type: "video" },
      ],
    },
    {
      id: 2,
      title: "Osnove programiranja",
      lessons: [
        { id: 4, title: "Varijable i tipovi podataka", duration: "15:45", type: "video" },
        { id: 5, title: "Kontrolne strukture", duration: "20:10", type: "video" },
        { id: 6, title: "Funkcije i metode", duration: "18:30", type: "video" },
        { id: 7, title: "Praktični zadaci", duration: "25:00", type: "practice" },
      ],
    },
    {
      id: 3,
      title: "Napredne tehnike",
      lessons: [
        { id: 8, title: "Objektno orijentirano programiranje", duration: "22:15", type: "video" },
        { id: 9, title: "Rad sa bazama podataka", duration: "28:40", type: "video" },
        { id: 10, title: "API integracije", duration: "24:50", type: "video" },
        { id: 11, title: "Završni projekat", duration: "45:00", type: "project" },
      ],
    },
  ]

  const toggleSection = (sectionId) => {
    if (openSection === sectionId) {
      setOpenSection(null)
    } else {
      setOpenSection(sectionId)
    }
  }

  const getLessonIcon = (type) => {
    switch (type) {
      case "video":
        return "bi-play-circle"
      case "practice":
        return "bi-code-square"
      case "project":
        return "bi-folder"
      default:
        return "bi-file-text"
    }
  }

  return (
    <div className="course-curriculum">
      <div className="course-section">
        <h3 className="course-section-title">Sadržaj kursa</h3>

        {sections.map((section) => (
          <div key={section.id} className="course-curriculum-item">
            <div className="course-curriculum-header" onClick={() => toggleSection(section.id)}>
              <h5>
                <i className={`bi ${openSection === section.id ? "bi-chevron-down" : "bi-chevron-right"} me-2`}></i>
                {section.title}
              </h5>
              <span className="badge badge-light-purple">{section.lessons.length} lekcija</span>
            </div>

            {openSection === section.id && (
              <div className="course-curriculum-body">
                {section.lessons.map((lesson) => (
                  <div key={lesson.id} className="course-curriculum-lesson">
                    <div className="course-curriculum-lesson-title">
                      <i className={`bi ${getLessonIcon(lesson.type)}`}></i>
                      <span>{lesson.title}</span>
                    </div>
                    <div className="course-curriculum-lesson-meta">
                      <span>{lesson.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
