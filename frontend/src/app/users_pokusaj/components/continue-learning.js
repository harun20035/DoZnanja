import Link from "next/link"
import Image from "next/image"
import { Play, Clock } from "lucide-react"
import styles from "./continue-learning.module.css"

export function ContinueLearning() {
  const inProgressCourses = [
    {
      id: 1,
      title: "Advanced JavaScript Concepts",
      instructor: "David Miller",
      progress: 68,
      lastLesson: "Closures and Scope",
      timeLeft: "32 min",
      image: "/placeholder.svg?height=120&width=200",
    },
    {
      id: 2,
      title: "React & Redux Masterclass",
      instructor: "Sarah Wilson",
      progress: 42,
      lastLesson: "State Management with Redux",
      timeLeft: "45 min",
      image: "/placeholder.svg?height=120&width=200",
    },
  ]

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Continue Learning</h2>
        <Link href="/user/courses" className={styles.viewAllLink}>
          View all my courses
        </Link>
      </div>

      <div className={styles.courseGrid}>
        {inProgressCourses.map((course) => (
          <div key={course.id} className={styles.courseCard}>
            <div className={styles.cardContent}>
              <div className={styles.courseLayout}>
                <div className={styles.imageContainer}>
                  <Image
                    src={course.image || "/placeholder.svg"}
                    alt={course.title}
                    fill
                    className={styles.courseImage}
                  />
                </div>
                <div className={styles.courseInfo}>
                  <h3 className={styles.courseTitle}>{course.title}</h3>
                  <p className={styles.courseInstructor}>by {course.instructor}</p>

                  <div className={styles.progressContainer}>
                    <div className={styles.progressHeader}>
                      <span className={styles.progressText}>{course.progress}% complete</span>
                      <span className={styles.lessonText}>{course.lastLesson}</span>
                    </div>
                    <div
                      className={styles.progressBar}
                      style={{ position: "relative", height: "0.5rem", backgroundColor: "#f3e8ff", borderRadius: "9999px" }}
                    >
                      <div
                        style={{
                          width: `${course.progress}%`,
                          height: "100%",
                          backgroundColor: "#6b46c1",
                          borderRadius: "9999px",
                          transition: "width 0.3s ease",
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className={styles.courseActions}>
                    <div className={styles.timeLeft}>
                      <Clock className={styles.timeIcon} />
                      <span>{course.timeLeft} left</span>
                    </div>
                    <button className={styles.continueButton}>
                      <Play className={styles.playIcon} />
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
