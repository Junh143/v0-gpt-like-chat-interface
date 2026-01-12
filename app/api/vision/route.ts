import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!)

export async function POST(request: Request) {
  try {
    const { image } = await request.json()

    if (!image) {
      return Response.json({ error: "이미지가 필요합니다" }, { status: 400 })
    }

    // base64 이미지에서 데이터 부분만 추출
    const base64Data = image.split(",")[1] || image

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Data,
          mimeType: "image/jpeg",
        },
      },
      "이 이미지에서 보이는 물체들을 한국어로 간단하게 설명해줘. 주요 물체 3-5개만 언급해. 문장으로 자연스럽게 설명해.",
    ])

    const response = result.response
    const description = response.text()

    return Response.json({ description })
  } catch (error) {
    console.error("[v0] Vision API 오류:", error)
    return Response.json({ error: "분석 실패" }, { status: 500 })
  }
}
