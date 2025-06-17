"use client"

import { useState, useEffect } from "react"
import { creatorService } from "../services/creatorService"

export function useCreatorApplication() {
  const [applicationStatus, setApplicationStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchApplicationStatus()
  }, [])

  const fetchApplicationStatus = async () => {
    try {
      setLoading(true)
      const status = await creatorService.getMyApplicationStatus()
      setApplicationStatus(status)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const submitApplication = async (applicationData) => {
    try {
      const result = await creatorService.submitCreatorApplication(applicationData)
      await fetchApplicationStatus() // Refresh status
      return result
    } catch (err) {
      throw err
    }
  }

  return {
    applicationStatus,
    loading,
    error,
    submitApplication,
    refetch: fetchApplicationStatus,
  }
}
