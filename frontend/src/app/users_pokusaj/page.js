"use client"

import React from "react"
import "./DashboardPage.css"

import { UserChatPreview } from "./components/chat-preview"
import { ContinueLearning } from "./components/continue-learning"
import { EnrolledCourses } from "./components/enrolled-courses"
import { LearningStats } from "./components/learning-stats"
import { PopularCourses } from "./components/popular-courses"
import { UserProfileCard } from "./components/profile-card"

export default function DashboardPage({ userData }) {
  return (
    <main style={{ minHeight: "100vh", backgroundColor: "white" }}>
      <div className="dashboardContainer">
        <ContinueLearning />

        <div className="cardsGrid">
          <div className="cardItem">
            <UserProfileCard />
          </div>
          <div className="cardItem">
            <UserChatPreview />
          </div>
          <div className="cardItem">
            <LearningStats />
          </div>
        </div>

        <EnrolledCourses />
        <PopularCourses />
      </div>
    </main>
  )
}
