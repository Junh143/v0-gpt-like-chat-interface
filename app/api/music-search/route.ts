import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export async function POST(request: Request) {
  try {
    const { query } = await request.json()

    if (!query) {
      return Response.json({ result: "검색어를 입력해주세요." })
    }

    const prompt = `사용자가 "${query}"라는 음악을 검색했습니다. 이 노래 또는 아티스트에 대한 정보를 한국어로 제공해주세요. 
다음 정보를 포함하세요:
1. 곡 제목 (또는 아티스트명)
2. 아티스트 정보
3. 장르
4. 릴리스 연도
5. 주요 특징 또는 가사 하이라이트
6. 유사한 곡 추천

존재하지 않는 노래인 경우 비슷한 노래를 추천해주세요.`

    const { text } = await generateText({
      model: groq("mixtral-8x7b-32768"),
      prompt: prompt,
    })

    return Response.json({ result: text })
  } catch (error) {
    console.error("Music search error:", error)
    return Response.json({ result: "음악 검색 중 오류가 발생했습니다." }, { status: 500 })
  }
}
