"use client"

import React from "react"
import { UserChatPreview } from "./components/chat-preview"
import { ContinueLearning } from "./components/continue-learning"
import { EnrolledCourses } from "./components/enrolled-courses"
import { LearningStats } from "./components/learning-stats"
import { PopularCourses } from "./components/popular-courses"
import { UserProfileCard } from "./components/profile-card"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useRouter } from 'next/navigation';
import { getRoleFromToken, getUserDataFromToken } from '@/utils/auth';
import getHeaderByRole from "../../../components/layoutComponents";
import Footer from "../../../components/footer/Footer";

export default function DashboardPage({ userData }) {
  const cardsGridStyle = {
    display: "grid",
    gap: "24px",
    marginTop: "40px",
    gridTemplateColumns: "1fr",
  }

  const [columns, setColumns] = React.useState(1)

  React.useEffect(() => {
    function updateColumns() {
      const width = window.innerWidth
      if (width >= 1024) setColumns(3)
      else if (width >= 768) setColumns(2)
      else setColumns(1)
    }
    updateColumns()
    window.addEventListener("resize", updateColumns)
    return () => window.removeEventListener("resize", updateColumns)
  }, [])

  const [role, setRole] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuthorization = () => {
      try {
        const role = getRoleFromToken();
        setRole(role);
        const user = getUserDataFromToken();
        
        // Ako korisnik ima bilo koju rolu, smatramo ga autoriziranim
        if (role) {
          // Dodatna logika ako je potrebno
        } else {
          router.push("/login"); // Preusmjeri na login ako nema role
        }
      } catch (error) {
        console.error("Authorization error:", error);
        router.push("/login");
      }
    };

    checkAuthorization();
  }, [router]);

  if (!role) {
    return <div>Loading...</div>; // Bolje od null za UX
  }

  return (
    <>
      {getHeaderByRole(role)}
      <main style={{ minHeight: "100vh", backgroundColor: "white" }}>
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "32px 16px",
          }}
        >
          <h1 style={{ fontSize: "2rem", fontWeight: "700", color: "#6b21a8", marginBottom: "32px" }}>
            Početna
          </h1>

          <ContinueLearning />

          <div
            style={{
              ...cardsGridStyle,
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
            }}
          >
            <UserProfileCard userData={userData} />
            <UserChatPreview />
            <LearningStats />
          </div>

          <EnrolledCourses />

          <PopularCourses />
        </div>
      </main>

      {/* Dodaj footer ispod main */}
      <Footer/>
    </>
  )
}
