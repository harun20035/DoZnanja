import Link from "next/link"
import Image from "next/image"
import { Star, Users, Clock } from "lucide-react"
import { Button, Card, CardContent, Typography, Box } from "@mui/material"
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
        <Typography variant="h5" component="h2" className={styles.title}>
          Popular Courses
        </Typography>
        <Link href="/courses" className={styles.browseLink}>
          Browse all courses
        </Link>
      </div>

      <div className={styles.courseGrid}>
        {courses.map((course) => (
          <Card key={course.id} className={styles.courseCard}>
            <Box className={styles.imageContainer} position="relative">
              <Image
                src={course.image || "/placeholder.svg"}
                alt={course.title}
                fill
                className={styles.courseImage}
              />
              {course.badge && <div className={styles.badgeContainer}>{course.badge}</div>}
              <div className={styles.levelBadge}>{course.level}</div>
            </Box>
            <CardContent className={styles.cardContent}>
              <Typography variant="h6" className={styles.courseTitle}>
                {course.title}
              </Typography>
              <Typography variant="body2" className={styles.courseInstructor}>
                by {course.instructor}
              </Typography>

              <Box className={styles.courseStats} display="flex" alignItems="center" gap={1}>
                <Box className={styles.rating} display="flex" alignItems="center" gap={0.5}>
                  <Star className={styles.starIcon} />
                  <Typography variant="body2" className={styles.ratingValue}>
                    {course.rating}
                  </Typography>
                </Box>
                <div className={styles.statDivider}>|</div>
                <Box className={styles.students} display="flex" alignItems="center" gap={0.5}>
                  <Users className={styles.studentsIcon} />
                  <Typography variant="body2">
                    {course.students.toLocaleString()} students
                  </Typography>
                </Box>
              </Box>

              <Box className={styles.courseDuration} display="flex" alignItems="center" gap={0.5}>
                <Clock className={styles.durationIcon} />
                <Typography variant="body2">{course.hours} total hours</Typography>
              </Box>

              <Box className={styles.courseFooter} display="flex" justifyContent="space-between" alignItems="center">
                <Box className={styles.priceContainer}>
                  <Typography variant="h6" component="span" className={styles.salePrice}>
                    ${course.salePrice}
                  </Typography>
                  <Typography variant="body2" component="span" className={styles.originalPrice} sx={{ marginLeft: 1 }}>
                    ${course.price}
                  </Typography>
                </Box>
                <Button size="small" className={styles.addButton}>
                  Add to Cart
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
