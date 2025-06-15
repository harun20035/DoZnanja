"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import CreatorBenefits from "./components/CreatorBenefits"
import CreatorCostNotice from "./components/CreatorCostNotice"
import CreatorApplicationForm from "./components/CreatorApplicationForm"
import LoadingSpinner from "./components/LoadingSpinner"
import CreatorHeader from "./components/CreatorHeader"
import "./styles/variables.css"
import "./page.css"

export default function CreatorFormPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const CREATOR_COST = 100

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("auth_token")
      if (!token) {
        router.push("/login")
        return
      }

      try {
        const response = await fetch("http://localhost:8000/api/me", {
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
      const token = localStorage.getItem("auth_token")
      const response = await fetch("http://localhost:8000/api/become-creator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reason: formData.reason,
          experience: formData.experience,
          expertise: formData.expertise,
        }),
      })

      if (response.ok) {
        alert("Vaša prijava je uspješno poslana! Uskoro ćete biti kontaktirani.")
        router.push("/")
      } else {
        const errorData = await response.json()
        alert(`Greška: ${errorData.message || "Nešto je pošlo po zlu"}`)
      }
    } catch (err) {
      console.error("Greška pri slanju prijave:", err)
      alert("Greška pri slanju prijave. Molimo pokušajte ponovo.")
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
            <CreatorBenefits />
            <CreatorCostNotice user={user} creatorCost={CREATOR_COST} />
            <CreatorApplicationForm
              user={user}
              creatorCost={CREATOR_COST}
              onSubmit={handleFormSubmit}
              submitting={submitting}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
