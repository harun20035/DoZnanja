"use client"

import "./components/dashboard.css"
import StatsSection from "./components/StatisticsSection"
import CreateCourseCard from "./components/CreateCourseCard"
import ProfileCard from "./components/ProfileCard"
import MessagesCard from "./components/MessagesCard"
import MyCourses from "./components/MyCoursesSection"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import getHeaderByRole from "../../components/layoutComponents"
import Footer from "../../components/footer/Footer"

export default function DashboardPage() {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [username, setUsername] = useState("")
  const [role, setRole] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Funkcija za provjeru korisničkih podataka iz API-ja
  const checkUserStatus = async () => {
    const token = localStorage.getItem("auth_token")
    if (!token) {
      console.log("Nema tokena, preusmjeravam na login")
      router.push("/login")
      return false
    }

    try {
      console.log("Dohvaćam podatke korisnika iz API-ja...")
      const response = await fetch("http://localhost:8000/api/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        console.log("API poziv neuspješan:", response.status)
        if (response.status === 401) {
          router.push("/login")
          return false
        }
        throw new Error("Failed to fetch user data")
      }

      const userData = await response.json()
      console.log("🔍 DETALJNI PODACI iz API-ja:", JSON.stringify(userData, null, 2))
      console.log("🔍 userData.role:", userData.role)
      console.log("🔍 typeof userData.role:", typeof userData.role)

      // Postavi podatke korisnika
      setUsername(userData.username || "")
      setRole(userData.role)

      // Provjeri da li je korisnik kreator ili admin
      if (userData.role === "CREATOR" || userData.role === "ADMIN") {
        console.log("✅ Korisnik je CREATOR ili ADMIN - dozvoljavamo pristup")
        setIsAuthorized(true)
        return true
      } else {
        console.log("❌ Korisnik nije CREATOR ni ADMIN, role:", userData.role)
        return false
      }
    } catch (err) {
      console.error("Greška pri dohvaćanju korisničkih podataka:", err)
      return false
    }
  }

  useEffect(() => {
    const initializeAuth = async () => {
      console.log("🔄 Inicijalizujem autentifikaciju...")

      const isCreator = await checkUserStatus()

      if (!isCreator) {
        console.log("Preusmjeravam na /unauthorized")
        router.push("/unauthorized")
      }

      setIsLoading(false)
    }

    initializeAuth()
  }, [router])

  // Slušaj za userUpdated event iz CreatorFormPage
  useEffect(() => {
    const handleUserUpdate = async (event) => {
      console.log("🔔 Received userUpdated event:", event.detail)
      const userData = event.detail

      if (userData.role === "CREATOR") {
        console.log("✅ Event potvrđuje CREATOR status")
        setRole(userData.role)
        setUsername(userData.username)
        setIsAuthorized(true)
        setIsLoading(false)
      }
    }

    window.addEventListener("userUpdated", handleUserUpdate)

    return () => {
      window.removeEventListener("userUpdated", handleUserUpdate)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-center">Provjeravam vaš status...</p>
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="text-center">
          <div className="spinner-border text-warning" role="status">
            <span className="visually-hidden">Redirecting...</span>
          </div>
          <p className="mt-3">Preusmjeravam vas...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {role && getHeaderByRole(role)}
      <div className="dashboard-container">
        <h1 className="welcome-title">Dobrodošli {username}</h1>
        <div className="dashboard-grid">
          <CreateCourseCard />
          <ProfileCard />
          <MessagesCard />
        </div>
        <StatsSection />
        <MyCourses />
      </div>
      <Footer />
    </>
  )
}
