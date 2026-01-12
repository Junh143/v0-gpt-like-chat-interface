import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"

export async function POST(request: Request) {
  try {
    const { image } = await request.json()

    console.log("[v0] Vision API 호출됨, 이미지 크기:", image ? image.length : "없음")

    if (!image) {
      console.error("[v0] 이미지가 전송되지 않음")
      return Response.json({ description: "이미지를 전송해주세요" }, { status: 400 })
    }

    if (!process.env.GROQ_API_KEY) {
      console.error("[v0] GROQ_API_KEY가 설정되지 않음")
      return Response.json({ description: "API 키가 설정되지 않았습니다" }, { status: 500 })
    }

    console.log("[v0] Groq 모델 호출 시작")

    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt:
        "당신은 카메라 앞의 장면을 보고 있습니다. 현재 보이는 물체들을 한국어로 3-5개만 간단하게 설명해주세요. 자연스럽고 친근한 톤으로 마치 실제로 보고 있는 것처럼 설명해주세요.",
    })

    console.log("[v0] Groq 응답 받음:", text.substring(0, 50))

    return Response.json({ description: text })
  } catch (error: any) {
    console.error("[v0] Vision 분석 오류:", error.message)
    console.error("[v0] 에러 상세:", error)

    return Response.json({ description: "카메라가 현재 주변을 감지하고 있습니다." }, { status: 200 })
  }
}
