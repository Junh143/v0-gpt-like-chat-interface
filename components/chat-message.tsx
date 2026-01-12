"use client"

import { User } from "lucide-react"
import { useEffect, useState } from "react"

interface ChatMessageProps {
  role: "user" | "assistant"
  content: string
  isLoading?: boolean
}

export function ChatMessage({ role, content, isLoading = false }: ChatMessageProps) {
  const isUser = role === "user"
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} transition-all duration-500 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className={`flex gap-3 max-w-[80%] ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        {/* 아바타 */}
        <div className="relative shrink-0">
          {!isUser && isLoading && (
            <div className="absolute -inset-1.5 w-11 h-11 rounded-full border-[3px] border-transparent border-t-white animate-spin" />
          )}
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 ${
              isVisible ? "scale-100" : "scale-0"
            } ${isUser ? "bg-blue-600 text-white" : "bg-zinc-700 text-zinc-300"}`}
          >
            {isUser ? <User className="h-4 w-4" /> : <span className="text-[8px] font-bold tracking-tight">AI5</span>}
          </div>
        </div>

        {/* 말풍선 */}
        <div
          className={`px-4 py-3 rounded-2xl transition-all duration-500 ease-out ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          } ${isUser ? "bg-blue-600 text-white rounded-br-md" : "bg-zinc-800 text-zinc-100 rounded-bl-md"}`}
        >
          <div className="leading-relaxed whitespace-pre-wrap">{content}</div>
        </div>
      </div>
    </div>
  )
}
