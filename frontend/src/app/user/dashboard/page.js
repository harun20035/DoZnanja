"use client"

import MyCourses from "./my-courses"
import "./dashboard.css"

export default function UserDashboard() {
  return (
    <div className="container-fluid p-4">
      <MyCourses />
    </div>
  )
}
