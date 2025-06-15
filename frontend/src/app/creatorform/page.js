"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import CreatorHeader from "./components/CreatorHeader"
import CreatorBenefits from "./components/CreatorBenefits"
import CreatorCostNotice from "./components/CreatorCostNotice"
import CreatorApplicationForm from "./components/CreatorApplicationForm"
import ApplicationStatus from "./components/ApplicationStatus"
import LoadingSpinner from "./components/LoadingSpinner"
import { useCreatorApplication } from "./hooks/useCreatorApplication"
import "./styles/variables.css"
import "./page.css"

export default function CreatorFormPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

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
        const response = await fetch("http://localhost:8000/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const userData = await response.json()
        setUser({ name: userData.username, coins: userData.credits })
      } catch (err) {
        console.error("Greška pri dohvaćanju korisničkih podataka:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  const handleFormSubmit = async (formData) => {
    setSubmitting(true)

    try {
      const result = await submitApplication({
        reason: formData.reason,
        experience: formData.experience,
        expertise: formData.expertise,
      })

      alert(`🎉 ${result.message}`)

      // Refresh user data to show updated credits and role
      const token = localStorage.getItem("auth_token")
      const response = await fetch("http://localhost:8000/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const userData = await response.json()
      setUser({ name: userData.username, coins: userData.credits })

      // Redirect to creator dashboard after 2 seconds
      setTimeout(() => {
        router.push("/creator/dashboard")
      }, 2000)
    } catch (err) {
      alert(`Greška: ${err.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <LoadingSpinner />
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
