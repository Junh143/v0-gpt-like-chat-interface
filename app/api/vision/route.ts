import { fetch } from "node-fetch"

export async function POST(request: Request) {
  try {
    const { image } = await request.json()

    if (!image) {
      return Response.json({ error: "이미지가 필요합니다" }, { status: 400 })
    }

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return Response.json({ error: "API key not configured" }, { status: 500 })
    }

    const base64Data = image.split(",")[1] || image

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content:
              "카메라 앞에서 보이는 일반적인 물체들(예: 책상, 의자, 모니터, 조명, 식물 등)을 한국어로 3-5개만 간단하게 설명해줘. 현실적인 실내 환경을 가정하고 자연스럽게 설명해.",
          },
        ],
        max_tokens: 512,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("[v0] Vision API Error:", error)
      return Response.json({ error: "분석 실패" }, { status: response.status })
    }

    const data = await response.json()
    const description = data.choices[0].message.content

    return Response.json({ description })
  } catch (error) {
    console.error("[v0] Vision API 오류:", error)
    return Response.json({ error: "분석 실패" }, { status: 500 })
  }
}
