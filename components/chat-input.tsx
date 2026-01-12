"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }, [input])

  const handleSubmit = () => {
    if (input.trim() && !disabled) {
      onSend(input.trim())
      setInput("")
    }
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
        <div className="relative flex items-end gap-3 bg-input/60 backdrop-blur-xl rounded-2xl border border-border/50 p-3 shadow-lg shadow-black/20 transition-all duration-300 focus-within:border-accent/50 focus-within:shadow-accent/10">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="메시지 입력..."
            className="flex-1 bg-transparent border-0 outline-none resize-none text-foreground placeholder:text-muted-foreground/60 min-h-[28px] max-h-[200px] py-1 text-[15px] font-light"
            rows={1}
            disabled={disabled}
          />
          <Button
            onClick={handleSubmit}
            disabled={!input.trim() || disabled}
            size="icon"
            className="shrink-0 bg-accent text-accent-foreground hover:bg-accent/80 disabled:opacity-30 disabled:bg-muted rounded-full h-8 w-8 transition-all duration-200"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
