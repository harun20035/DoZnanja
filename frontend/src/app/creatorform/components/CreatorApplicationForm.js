"use client"

import { useState } from "react"
import Link from "next/link"
import "./CreatorApplicationForm.css"

export default function CreatorApplicationForm({ user, creatorCost, onSubmit, submitting }) {
  const [formData, setFormData] = useState({
    reason: "",
    experience: "",
    expertise: "",
    termsAccepted: false,
    costAccepted: false,
  })
  const [errors, setErrors] = useState({})

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
    // Ukloni grešku kada korisnik počne tipkati
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.reason.trim()) {
      newErrors.reason = "Molimo unesite razlog zašto želite postati kreator"
    }

    if (!formData.experience.trim()) {
      newErrors.experience = "Molimo opišite svoje iskustvo"
    }

    if (!formData.expertise.trim()) {
      newErrors.expertise = "Molimo navedite svoju ekspertizu"
    }

    if (!formData.termsAccepted) {
      newErrors.termsAccepted = "Morate prihvatiti uvjete korištenja"
    }

    if (!formData.costAccepted) {
      newErrors.costAccepted = "Morate potvrditi da prihvaćate trošak"
    }

    if (user && user.coins < creatorCost) {
      newErrors.insufficient = `Nemate dovoljno tokena. Potrebno je ${creatorCost} tokena, a imate ${user.coins}.`
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  return (
    <div className="application-form">
      <h3 className="section-title mb-4">
        <i className="bi bi-file-text me-2"></i>
        Prijava za kreator
      </h3>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="reason" className="form-label">
            Zašto želite postati kreator? *
          </label>
          <textarea
            id="reason"
            name="reason"
            className={`form-control ${errors.reason ? "is-invalid" : ""}`}
            rows="4"
            placeholder="Opišite svoju motivaciju i ciljeve..."
            value={formData.reason}
            onChange={handleInputChange}
          ></textarea>
          {errors.reason && <div className="invalid-feedback">{errors.reason}</div>}
        </div>

        <div className="mb-4">
          <label htmlFor="experience" className="form-label">
            Vaše iskustvo i kvalifikacije *
          </label>
          <textarea
            id="experience"
            name="experience"
            className={`form-control ${errors.experience ? "is-invalid" : ""}`}
            rows="4"
            placeholder="Opišite svoje radno iskustvo, obrazovanje i postignuća..."
            value={formData.experience}
            onChange={handleInputChange}
          ></textarea>
          {errors.experience && <div className="invalid-feedback">{errors.experience}</div>}
        </div>

        <div className="mb-4">
          <label htmlFor="expertise" className="form-label">
            Oblast ekspertize *
          </label>
          <input
            type="text"
            id="expertise"
            name="expertise"
            className={`form-control ${errors.expertise ? "is-invalid" : ""}`}
            placeholder="npr. Web Development, Data Science, Digital Marketing..."
            value={formData.expertise}
            onChange={handleInputChange}
          />
          {errors.expertise && <div className="invalid-feedback">{errors.expertise}</div>}
        </div>

        {/* Terms and Conditions */}
        <div className="terms-section mb-4">
          <div className="form-check mb-3">
            <input
              className={`form-check-input ${errors.termsAccepted ? "is-invalid" : ""}`}
              type="checkbox"
              id="termsAccepted"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleInputChange}
            />
            <label className="form-check-label" htmlFor="termsAccepted">
              Prihvaćam{" "}
              <Link href="/terms" className="text-purple">
                uvjete korištenja
              </Link>{" "}
              i{" "}
              <Link href="/privacy" className="text-purple">
                pravila privatnosti
              </Link>{" "}
              za kreatore *
            </label>
            {errors.termsAccepted && <div className="invalid-feedback d-block">{errors.termsAccepted}</div>}
          </div>

          <div className="form-check mb-3">
            <input
              className={`form-check-input ${errors.costAccepted ? "is-invalid" : ""}`}
              type="checkbox"
              id="costAccepted"
              name="costAccepted"
              checked={formData.costAccepted}
              onChange={handleInputChange}
            />
            <label className="form-check-label" htmlFor="costAccepted">
              Razumijem da će mi biti naplaćeno {creatorCost} tokena za registraciju kao kreator *
            </label>
            {errors.costAccepted && <div className="invalid-feedback d-block">{errors.costAccepted}</div>}
          </div>
        </div>

        {/* Error Messages */}
        {errors.insufficient && (
          <div className="alert alert-danger" role="alert">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {errors.insufficient}
            <div className="mt-2">
              <Link href="/tokens" className="btn btn-sm btn-outline-danger">
                Kupite tokene
              </Link>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="btn btn-purple btn-lg px-5"
            disabled={submitting || (user && user.coins < creatorCost)}
          >
            {submitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Slanje prijave...
              </>
            ) : (
              <>
                <i className="bi bi-send me-2"></i>
                Pošaljite prijavu
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
