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

    const result = await response.json()

    // Ako backend vrati ažurirane user podatke, možemo ih koristiti
    if (result.user) {
      // Možemo emitovati event ili vratiti user podatke
      window.dispatchEvent(
        new CustomEvent("userUpdated", {
          detail: result.user,
        }),
      )
    }

    return result
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
