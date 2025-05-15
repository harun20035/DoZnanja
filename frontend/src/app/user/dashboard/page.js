"use client"

import { useState } from "react"
import MyCourses from "./my-courses"
import AllCourses from "./all-courses"
import "./dashboard.css"

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("my-courses")

  const renderContent = () => {
    switch (activeTab) {
      case "my-courses":
        return <MyCourses />
      case "all-courses":
        return <AllCourses />
      default:
        return <MyCourses />
    }
  }

  return (
    <div className="container-fluid p-0">
      <div className="row g-0">
        <div className="col-md-9 col-lg-10">
          <main className="p-4">{renderContent()}</main>
        </div>
      </div>
    </div>
  )
}
