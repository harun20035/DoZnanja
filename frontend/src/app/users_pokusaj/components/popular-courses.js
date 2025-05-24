import Link from "next/link"
import Image from "next/image"
import { Star, Users, Clock } from "lucide-react"
import styles from "./popular-courses.module.css"

export function PopularCourses() {
  const courses = [
    {
      id: 1,
      title: "Complete Web Development Bootcamp",
      instructor: "Jessica Parker",
      price: 89.99,
      salePrice: 19.99,
      rating: 4.9,
      students: 12500,
      hours: 42,
      level: "Beginner",
      image: "/placeholder.svg?height=160&width=280",
      badge: "Bestseller",
    },
    {
      id: 2,
      title: "Machine Learning A-Z: Hands-On Python & R",
      instructor: "Robert Johnson",
      price: 129.99,
      salePrice: 24.99,
      rating: 4.8,
      students: 9800,
      hours: 36,
      level: "Intermediate",
      image: "/placeholder.svg?height=160&width=280",
      badge: "Hot & New",
    },
    {
      id: 3,
      title: "iOS App Development with Swift",
      instructor: "Thomas Lee",
      price: 99.99,
      salePrice: 29.99,
      rating: 4.7,
      students: 7200,
      hours: 28,
      level: "Intermediate",
      image: "/placeholder.svg?height=160&width=280",
    },
    {
      id: 4,
      title: "Digital Marketing Masterclass",
      instructor: "Sophia Martinez",
      price: 79.99,
      salePrice: 14.99,
      rating: 4.6,
      students: 15800,
      hours: 24,
      level: "All Levels",
      image: "/placeholder.svg?height=160&width=280",
      badge: "Bestseller",
    },
  ]

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Popular Courses</h2>
        <Link href="/courses" className={styles.browseLink}>
          Browse all courses
        </Link>
      </div>

      <div className={styles.courseGrid}>
        {courses.map((course) => (
          <article key={course.id} className={styles.courseCard}>
            <div className={styles.imageContainer}>
              <Image
                src={course.image || "/placeholder.svg"}
                alt={course.title}
                fill
                className={styles.courseImage}
              />
              {course.badge && (
                <div className={styles.badgeContainer}>{course.badge}</div>
              )}
              <div className={styles.levelBadge}>{course.level}</div>
            </div>

            <div className={styles.cardContent}>
              <h3 className={styles.courseTitle}>{course.title}</h3>
              <p className={styles.courseInstructor}>by {course.instructor}</p>

              <div className={styles.courseStats}>
                <div className={styles.rating}>
                  <Star className={styles.starIcon} />
                  <span className={styles.ratingValue}>{course.rating}</span>
                </div>
                <div className={styles.statDivider}>|</div>
                <div className={styles.students}>
                  <Users className={styles.studentsIcon} />
                  {course.students.toLocaleString()} students
                </div>
              </div>

              <div className={styles.courseDuration}>
                <Clock className={styles.durationIcon} />
                {course.hours} total hours
              </div>

              <div className={styles.courseFooter}>
                <div className={styles.priceContainer}>
                  <span className={styles.salePrice}>${course.salePrice}</span>
                  <span className={styles.originalPrice}>${course.price}</span>
                </div>
                <button className={styles.addButton} type="button">
                  Add to Cart
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
