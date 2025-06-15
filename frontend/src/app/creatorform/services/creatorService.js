const API_BASE_URL = "http://localhost:8000"

export const creatorService = {
  // Pošalji prijavu za kreator
  async submitCreatorApplication(applicationData) {
    const token = localStorage.getItem("auth_token")

    const response = await fetch(`${API_BASE_URL}/become-creator`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(applicationData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || "Greška pri slanju prijave")
    }

    return response.json()
  },

  // Dobij status svoje prijave
  async getMyApplicationStatus() {
    const token = localStorage.getItem("auth_token")

    const response = await fetch(`${API_BASE_URL}/my-creator-application`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Greška pri dohvaćanju statusa prijave")
    }

    return response.json()
  },
}
