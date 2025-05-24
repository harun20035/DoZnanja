import Image from "next/image"
import { Star } from "lucide-react"
import styles from "./enrolled-courses.module.css"

export function EnrolledCourses() {
  const courses = [
    {
      id: 1,
      title: "Advanced JavaScript Concepts",
      instructor: "David Miller",
      progress: 68,
      rating: 4.8,
      totalHours: 12.5,
      completedHours: 8.5,
      image: "/placeholder.svg?height=160&width=280",
      category: "Programming",
    },
    {
      id: 2,
      title: "React & Redux Masterclass",
      instructor: "Sarah Wilson",
      progress: 42,
      rating: 4.9,
      totalHours: 15,
      completedHours: 6.3,
      image: "/placeholder.svg?height=160&width=280",
      category: "Web Development",
    },
    {
      id: 3,
      title: "UX/UI Design Fundamentals",
      instructor: "Michael Chen",
      progress: 25,
      rating: 4.7,
      totalHours: 10,
      completedHours: 2.5,
      image: "/placeholder.svg?height=160&width=280",
      category: "Design",
    },
    {
      id: 4,
      title: "Data Science with Python",
      instructor: "Emily Rodriguez",
      progress: 12,
      rating: 4.6,
      totalHours: 18,
      completedHours: 2.2,
      image: "/placeholder.svg?height=160&width=280",
      category: "Data Science",
    },
  ]

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>My Enrolled Courses</h2>
        <div className={styles.filterContainer}>
          <select className={styles.filterSelect}>
            <option>All Categories</option>
            <option>Programming</option>
            <option>Web Development</option>
            <option>Design</option>
            <option>Data Science</option>
          </select>
          <select className={styles.filterSelect}>
            <option>In Progress</option>
            <option>Completed</option>
            <option>Not Started</option>
          </select>
        </div>
      </div>

      <div className={styles.courseGrid}>
        {courses.map((course) => (
          <div key={course.id} className={styles.courseCard}>
            <div className={styles.imageContainer}>
              <Image
                src={course.image || "/placeholder.svg"}
                alt={course.title}
                fill
                className={styles.courseImage}
                sizes="(max-width: 768px) 100vw,
                       (max-width: 1024px) 50vw,
                       25vw"
                priority={false}
              />
              <div className={styles.categoryBadge}>{course.category}</div>
            </div>

            <div className={styles.cardContent}>
              <h3 className={styles.courseTitle}>{course.title}</h3>
              <p className={styles.courseInstructor}>by {course.instructor}</p>

              <div className={styles.progressContainer}>
                <div className={styles.progressHeader}>
                  <span>{course.progress}% complete</span>
                  <span>
                    {course.completedHours}/{course.totalHours} hours
                  </span>
                </div>

                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className={styles.courseFooter}>
                <div className={styles.rating}>
                  <Star className={styles.starIcon} />
                  <span>{course.rating}</span>
                </div>

                <button className={styles.continueButton}>Continue</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.viewAllContainer}>
        <button className={styles.viewAllButton}>View All My Courses</button>
      </div>
    </div>
  )
}
