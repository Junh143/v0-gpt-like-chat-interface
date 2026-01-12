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
            content: [
              {
                type: "text",
                text: "이 이미지에서 보이는 물체들을 한국어로 간단하게 설명해줘. 주요 물체 3-5개만 언급해. 문장으로 자연스럽게 설명해.",
              },
              {
                type: "image_url",
                image_url: {
                  url: image,
                },
              },
            ],
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
