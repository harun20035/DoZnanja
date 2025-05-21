import "./components/dashboard.css"
import StatsSection from "./components/StatisticsSection"
import CreateCourseCard from "./components/CreateCourseCard"
import ProfileCard from "./components/ProfileCard"
import MessagesCard from "./components/MessagesCard"
import MyCourses from "./components/MyCoursesSection"
import userData from "./components/ProfileCard"



export default function DashboardPage() {
  return (
    <div className="dashboard-container">
        <h1 className="welcome-title">Welcome {userData.username}</h1>
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
