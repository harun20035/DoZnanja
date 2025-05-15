"use client"

import { useState } from "react"
import Sidebar from "./sidebar"
import Navbar from "./navbar"
import MyCourses from "./my-courses"
import AllCourses from "./all-courses"
import Chat from "./chat"
import Profile from "./profile"
import "./dashboard.css"

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("my-courses")

  const renderContent = () => {
    switch (activeTab) {
      case "my-courses":
        return <MyCourses />
      case "all-courses":
        return <AllCourses />
      case "chat":
        return <Chat />
      case "profile":
        return <Profile />
      default:
        return <MyCourses />
    }
  }

  return (
    <div className="container-fluid p-0">
      <div className="row g-0">
        <div className="col-md-3 col-lg-2 d-none d-md-block">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <div className="col-md-9 col-lg-10">
          <Navbar setActiveTab={setActiveTab} />
          <main className="p-4">{renderContent()}</main>
        </div>
      </div>
    </div>
  )
}
