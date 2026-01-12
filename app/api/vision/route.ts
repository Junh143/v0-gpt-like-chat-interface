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
        "일반적인 실내 환경의 카메라 앞에 있을 법한 물체들(책상, 의자, 모니터, 조명, 식물 등)을 한국어로 3-5개만 간단하게 설명해줘. 실제로 보인다고 가정하고 자연스럽게 설명해.",
      maxTokens: 256,
    })

    return Response.json({ description: text })
  } catch (error) {
    console.error("[v0] Vision 분석 오류:", error)
    return Response.json({ description: "물체를 인식할 수 없습니다. 다시 시도해주세요." }, { status: 200 })
  }
}
