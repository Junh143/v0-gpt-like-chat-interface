import { Groq } from "@ai-sdk/groq"
import { generateText } from "ai"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

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

    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt:
        "당신은 카메라 앞의 장면을 보고 있습니다. 현재 보이는 물체들을 한국어로 3-5개만 간단하게 설명해주세요. 자연스럽고 친근한 톤으로 마치 실제로 보고 있는 것처럼 설명해주세요. 예: '책상 위에 모니터, 키보드, 마우스가 있고...'",
      maxTokens: 150,
    })

    return Response.json({ description: text })
  } catch (error) {
    console.error("[v0] Vision 분석 오류:", error)
    return Response.json({ description: "지금은 분석을 할 수 없습니다. 잠시 후 다시 시도해주세요." }, { status: 200 })
  }
}
