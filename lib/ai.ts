export async function generateAIResponse(message: string, isLearning?: boolean, language?: string): Promise<string> {
  try {
    const customSystemPrompt = localStorage.getItem("customSystemPrompt") || ""
    const responseLength = localStorage.getItem("responseLength") || "medium"
    const noRestrictions = localStorage.getItem("noRestrictions") === "true"

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        isLearning,
        language,
        customSystemPrompt,
        responseLength,
        noRestrictions,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to get response")
    }

    const data = await response.json()
    return data.response
  } catch (error) {
    console.error("Error calling AI API:", error)
    return "Sorry, I encountered an error processing your request."
  }
}
