"use client"

import { forwardRef } from "react"
import { Loader } from "lucide-react"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
}

interface ChatMessagesProps {
  messages: Message[]
  isLoading: boolean
  onAIResponse?: () => void
}

const ChatMessages = forwardRef<HTMLDivElement, ChatMessagesProps>(({ messages, isLoading, onAIResponse }, ref) => {
  const playNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const now = audioContext.currentTime

      // 부드러운 차임벨 효과음 생성
      const osc1 = audioContext.createOscillator()
      const osc2 = audioContext.createOscillator()
      const gain = audioContext.createGain()
      const gainEnv = audioContext.createGain()

      // 더 낮은 주파수로 부드러운 음색 생성
      osc1.frequency.value = 528 // 따뜻한 톤 (낮은 주파수)
      osc2.frequency.value = 624 // 부드러운 상음
      osc1.type = "sine"
      osc2.type = "sine"

      // 천천히 감소하는 엔벨로프로 자연스러운 감쇠
      gainEnv.gain.setValueAtTime(0.2, now)
      gainEnv.gain.exponentialRampToValueAtTime(0.01, now + 0.6)

      gain.gain.setValueAtTime(1, now)
      gain.gain.exponentialRampToValueAtTime(0.1, now + 0.6)

      osc1.connect(gain)
      osc2.connect(gain)
      gain.connect(gainEnv)
      gainEnv.connect(audioContext.destination)

      osc1.start(now)
      osc2.start(now)
      osc1.stop(now + 0.6)
      osc2.stop(now + 0.6)
    } catch (e) {
      console.log("오디오 재생 불가")
    }
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 && !isLoading && (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <p>대화를 시작해보세요...</p>
        </div>
      )}

      {messages.map((message, index) => (
        <div
          key={message.id}
          className={`flex message-animation ${message.type === "user" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-2xl px-4 py-3 rounded-2xl transition-all duration-200 ${
              message.type === "user"
                ? "bg-primary text-primary-foreground"
                : "bg-card text-card-foreground border border-border ai-response-animation"
            }`}
          >
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="flex justify-start message-animation">
          <div className="loading-bubble bg-card text-card-foreground border border-border px-4 py-3 rounded-2xl flex items-center gap-2">
            <Loader className="animate-spin" size={16} />
            <span>생각 중...</span>
          </div>
        </div>
      )}

      {messages.length > 0 &&
        messages[messages.length - 1]?.type === "assistant" &&
        !isLoading &&
        (() => {
          if (onAIResponse) onAIResponse()
          return null
        })()}

      <div ref={ref} />
    </div>
  )
})

ChatMessages.displayName = "ChatMessages"

export default ChatMessages
