import './dashboard.css'
import StatsSection from './StatisticsSection'
import CreateCourseCard from './CreateCourseCard'
import ProfileCard from './ProfileCard'
import MessagesCard from './MessagesCard'
import MyCourses from './MyCoursesSection'

export default function DashboardPage() {
  return (
    <div className="dashboard-container">
        <h1 className="welcome-title">Welcome, nickname</h1>
      <div className="dashboard-grid">
            <CreateCourseCard />
            <ProfileCard />
            <MessagesCard />
        </div>
      <StatsSection />
      <MyCourses />
    </div>
  )
}
