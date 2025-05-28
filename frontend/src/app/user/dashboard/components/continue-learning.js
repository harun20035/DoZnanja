import Link from "next/link"
import Image from "next/image"
import { Play, Clock } from "lucide-react"
import { Button, Card, CardContent, LinearProgress, Typography } from "@mui/material"
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
        <Typography variant="h5" component="h2" className={styles.title}>
          Continue Learning
        </Typography>
        <Link href="/user/courses" className={styles.viewAllLink}>
          View all my courses
        </Link>
      </div>

      <div className={styles.courseGrid}>
        {inProgressCourses.map((course) => (
          <Card key={course.id} className={styles.courseCard}>
            <CardContent className={styles.cardContent}>
              <div className={styles.courseLayout}>
                <div className={styles.imageContainer} style={{ position: "relative", width: "200px", height: "120px" }}>
                  <Image
                    src={course.image || "/placeholder.svg"}
                    alt={course.title}
                    fill
                    className={styles.courseImage}
                    style={{ objectFit: "cover" }}
                  />
                </div>

                <div className={styles.courseInfo}>
                  <Typography variant="h6" component="h3" className={styles.courseTitle}>
                    {course.title}
                  </Typography>
                  <Typography variant="body2" className={styles.courseInstructor}>
                    by {course.instructor}
                  </Typography>

                  <div className={styles.progressContainer}>
                    <div className={styles.progressHeader}>
                      <span className={styles.progressText}>{course.progress}% complete</span>
                      <span className={styles.lessonText}>{course.lastLesson}</span>
                    </div>
                    <LinearProgress
                      variant="determinate"
                      value={course.progress}
                      className={styles.progressBar}
                    />
                  </div>

                  <div className={styles.courseActions}>
                    <div className={styles.timeLeft}>
                      <Clock className={styles.timeIcon} />
                      <span>{course.timeLeft} left</span>
                    </div>
                    <Button size="small" variant="contained" className={styles.continueButton} startIcon={<Play className={styles.playIcon} />}>
                      Continue
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
