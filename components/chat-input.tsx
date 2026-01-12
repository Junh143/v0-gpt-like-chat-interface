"use client"

import React, { useState, useRef, useEffect } from "react"
import { ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // 텍스트 자동 높이
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`
    }
  }, [input])

  const handleSubmit = () => {
    if (!input.trim() || disabled) return
    onSend(input.trim())
    setInput("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="bg-chat-background p-6">
      <div className="max-w-2xl mx-auto">
        <div className="relative flex items-end gap-3 bg-input/60 backdrop-blur-xl rounded-2xl border border-border/50 p-3 shadow-lg shadow-black/20 transition-all duration-300">
          
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full resize-none bg-transparent outline-none text-base"
            placeholder="메시지를 입력하세요..."
            rows={1}
          />

          <Button
            size="icon"
            disabled={disabled || !input.trim()}
            onClick={handleSubmit}
          >
            <ArrowUp />
          </Button>
        </div>
      </div>
    </div>
  )
}
