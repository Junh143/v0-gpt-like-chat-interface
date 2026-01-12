"use client"

import React, { useState } from "react"
import { ChatInput } from "@/components/chat-input"

export default function Page() {
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const handleSend = async (text: string) => {
    const userMessage = { role: "user", content: text }

    // 화면에 먼저 사용자 메시지 추가
    setMessages((prev) => [...prev, userMessage])

    setLoading(true)

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [...messages, userMessage], // 기존 + 새 메시지 전송
      }),
    })

    const data = await res.json()
    setLoading(false)

    if (data.reply) {
      setMessages((prev) => [...prev, data.reply])
    }
  }

  return (
    <div className="flex flex-col h-screen">
      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className="text-white">
            <span className="font-bold">{msg.role}:</span> {msg.content}
          </div>
        ))}

        {loading && (
          <div className="opacity-60 text-sm">응답 생성 중...</div>
        )}
      </div>

      {/* 입력창 */}
      <ChatInput onSend={handleSend} disabled={loading} />
    </div>
  )
}
