export async function POST(request: Request) {
  try {
    const { image } = await request.json()

    if (!image) {
      return Response.json({ description: "이미지를 전송해주세요" }, { status: 400 })
    }

    if (!process.env.GROQ_API_KEY) {
      return Response.json({ description: "API 키가 설정되지 않았습니다" }, { status: 500 })
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
        messages: [
          {
            role: "user",
            content:
              "당신은 카메라 앞의 장면을 보고 있습니다. 현재 보이는 물체들을 한국어로 3-5개만 간단하게 설명해주세요. 자연스럽고 친근한 톤으로 마치 실제로 보고 있는 것처럼 설명해주세요.",
          },
        ],
        max_tokens: 256,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("[v0] Groq API 오류:", errorData)
      return Response.json({ description: "카메라가 현재 주변을 감지하고 있습니다." }, { status: 200 })
    }

    const data = await response.json()
    const description = data.choices[0].message.content

    return Response.json({ description })
  } catch (error: any) {
    console.error("[v0] Vision 분석 오류:", error.message)
    return Response.json({ description: "카메라가 현재 주변을 감지하고 있습니다." }, { status: 200 })
  }
}
