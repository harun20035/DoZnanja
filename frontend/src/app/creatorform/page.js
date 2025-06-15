"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import CreatorHeader from "./components/CreatorHeader"
import CreatorBenefits from "./components/CreatorBenefits"
import CreatorCostNotice from "./components/CreatorCostNotice"
import CreatorApplicationForm from "./components/CreatorApplicationForm"
import ApplicationStatus from "./components/ApplicationStatus"
import LoadingSpinner from "./components/LoadingSpinner"
import SuccessAnimation from "./components/SuccessAnimation"
import { useCreatorApplication } from "./hooks/useCreatorApplication"
import "./styles/variables.css"
import "./page.css"

export default function CreatorFormPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false)

  const { applicationStatus, submitApplication } = useCreatorApplication()

  const CREATOR_COST = 100

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("auth_token")
      if (!token) {
        router.push("/login")
        return
      }

      try {
        console.log("🔄 CreatorForm - Dohvaćam podatke korisnika...")
        const response = await fetch("http://localhost:8000/api/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch user data")
        }

        const userData = await response.json()
        console.log("📊 CreatorForm - Podaci korisnika:", userData)

        setUser({
          name: userData.username,
          coins: userData.credits,
          role: userData.role,
        })

        // Ako je korisnik već kreator, preusmjeri ga na creator dashboard
        if (userData.role === "CREATOR") {
          console.log("✅ CreatorForm - Korisnik je već CREATOR, preusmjeravam na /creator")
          router.push("/creator")
          return
        }
      } catch (err) {
        console.error("Greška pri dohvaćanju korisničkih podataka:", err)
        if (err.message.includes("401") || err.message.includes("Unauthorized")) {
          router.push("/login")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  const handleFormSubmit = async (formData) => {
    setSubmitting(true)

    try {
      console.log("📤 Šaljem prijavu za kreator...")
      const result = await submitApplication({
        reason: formData.reason,
        experience: formData.experience,
        expertise: formData.expertise,
      })

      console.log("✅ Prijava uspješna:", result)

      // Ažuriraj user podatke odmah nakon uspješne prijave
      const token = localStorage.getItem("auth_token")
      const response = await fetch("http://localhost:8000/api/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const updatedUserData = await response.json()
        console.log("🔄 Ažurirani podaci korisnika:", updatedUserData)

        setUser({
          name: updatedUserData.username,
          coins: updatedUserData.credits,
          role: updatedUserData.role,
        })

        // Pošalji event za ažuriranje drugih komponenti
        window.dispatchEvent(
          new CustomEvent("userUpdated", {
            detail: updatedUserData,
          }),
        )

        // Prikaži success animaciju
        setShowSuccessAnimation(true)
      }
    } catch (err) {
      console.error("❌ Greška pri slanju prijave:", err)
      alert(`Greška: ${err.message}`)
      setSubmitting(false)
    }
  }

  const handleAnimationComplete = () => {
    console.log("🎬 Animacija završena, preusmjeravam na /creator")
    // Preusmjeri na creator dashboard
    router.push("/creator")
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (showSuccessAnimation) {
    return <SuccessAnimation onComplete={handleAnimationComplete} />
  }

  return (
    <div className="creator-form-page">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <CreatorHeader />

            {/* Prikaži status ako je već kreator */}
            <ApplicationStatus status={applicationStatus} />

            {/* Prikaži formu samo ako nije kreator */}
            {!applicationStatus?.has_application && (
              <>
                <CreatorBenefits />
                <CreatorCostNotice user={user} creatorCost={CREATOR_COST} />
                <CreatorApplicationForm
                  user={user}
                  creatorCost={CREATOR_COST}
                  onSubmit={handleFormSubmit}
                  submitting={submitting}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
