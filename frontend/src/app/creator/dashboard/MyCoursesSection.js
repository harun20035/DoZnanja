import "./dashboard.css"
import Link from "next/link"
import Image from "next/image"


export default function MyCoursesSection() {
  const courses = [
    {
      id: 1,
      title: "Complete Web Development Bootcamp",
      students: 523,
      rating: 4.9,
      revenue: "$4,250",
      lastUpdated: "2 weeks ago",
      published: true,
    },
    {
      id: 2,
      title: "Advanced JavaScript Concepts",
      students: 412,
      rating: 4.7,
      revenue: "$3,180",
      lastUpdated: "1 month ago",
      published: true,
    },
    {
      id: 3,
      title: "React & Redux Masterclass",
      students: 313,
      rating: 4.8,
      revenue: "$2,560",
      lastUpdated: "3 weeks ago",
      published: true,
    },
    {
      id: 4,
      title: "Introduction to TypeScript",
      students: 0,
      rating: 0,
      revenue: "$0",
      lastUpdated: "1 day ago",
      published: false,
    },
  ]

  return (
    <div className="section">
      <div className="section-header">
        <h2 className="section-title">My Courses</h2>
        <Link href="/creator/courses/new" className="btn-purple">Create New Course</Link>
      </div>

      <div className="course-list">
        {courses.map((course) => (
          <div key={course.id} className="course-card">
            <div className="course-image-wrapper">
              <Image
                src="/placeholder.svg?height=160&width=192"
                alt={course.title}
                fill
                className="course-image"
              />
              {!course.published && <span className="draft-badge">Draft</span>}
            </div>

            <div className="course-content">
              <div className="course-header">
                <h3 className="course-title">{course.title}</h3>
                <div className="course-actions">
                  <button className="btn-outline">✏ Edit</button>
                  <button className="btn-outline">👁 Preview</button>
                  <button className="btn-outline">📊 Stats</button>
                </div>
              </div>

              <div className="course-info">
                <div><p className="info-label">Students</p><p>{course.students}</p></div>
                <div><p className="info-label">Rating</p><p>{course.rating > 0 ? course.rating : "N/A"}</p></div>
                <div><p className="info-label">Revenue</p><p>{course.revenue}</p></div>
                <div><p className="info-label">Last Updated</p><p>{course.lastUpdated}</p></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
