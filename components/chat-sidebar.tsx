"use client"

import { Button } from "@/components/ui/button"
import { Trash2, Plus, BookOpen, Mic, Settings, Camera, Music } from "lucide-react"
import { useState, useRef } from "react"

interface Conversation {
  id: string
  title: string
  messages: any[]
  createdAt: number
}

interface ChatSidebarProps {
  conversations: Conversation[]
  currentConversationId: string | null
  onSelectConversation: (id: string) => void
  onNewConversation: () => void
  onDeleteConversation: (id: string) => void
  onLearnLanguage?: () => void
  onVoiceChat?: () => void
  onDevSettings?: () => void // Add dev settings prop
  onAICamera?: () => void // Add AI Camera prop
  onMusicSearch?: () => void
}

export default function ChatSidebar({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onLearnLanguage,
  onVoiceChat,
  onDevSettings,
  onAICamera,
  onMusicSearch, // Add AI Camera prop
}: ChatSidebarProps) {
  const [longPressId, setLongPressId] = useState<string | null>(null)
  const longPressTimer = useRef<NodeJS.Timeout | null>(null)

  const handleMouseDown = (id: string) => {
    longPressTimer.current = setTimeout(() => {
      setLongPressId(id)
    }, 500) // 0.5초 길게 누르면 표시
  }

  const handleMouseUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
    }
  }

  return (
    <div className="w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col overflow-hidden">
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-lg font-bold text-sidebar-foreground">Obryn AI Chat</h1>
          {onDevSettings && (
            <button
              onClick={onDevSettings}
              className="p-1 hover:bg-sidebar-accent rounded-lg transition-colors"
              title="개발자 설정"
            >
              <Settings size={18} className="text-sidebar-foreground" />
            </button>
          )}
        </div>
        <div className="space-y-2">
          <Button
            onClick={onNewConversation}
            className="w-full gap-2 bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
          >
            <Plus size={18} />
            New chat
          </Button>
          {onVoiceChat && (
            <Button
              onClick={onVoiceChat}
              className="w-full gap-2 bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/90"
            >
              <Mic size={18} />
              음성 채팅
            </Button>
          )}
          {onMusicSearch && (
            <Button
              onClick={onMusicSearch}
              className="w-full gap-2 bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/90"
            >
              <Music size={18} />
              음악 검색
            </Button>
          )}
          {onAICamera && (
            <Button
              onClick={onAICamera}
              className="w-full gap-2 bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/90"
            >
              <Camera size={18} />
              AI 카메라
            </Button>
          )}
          {onLearnLanguage && (
            <Button
              onClick={onLearnLanguage}
              className="w-full gap-2 bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/90"
            >
              <BookOpen size={18} />
              언어 배우기
            </Button>
          )}
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            onMouseDown={() => handleMouseDown(conversation.id)}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={() => handleMouseDown(conversation.id)}
            onTouchEnd={handleMouseUp}
            className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors select-none ${
              currentConversationId === conversation.id
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "hover:bg-sidebar-accent text-sidebar-foreground"
            }`}
            onClick={() => {
              if (longPressId !== conversation.id) {
                onSelectConversation(conversation.id)
              }
              setLongPressId(null)
            }}
          >
            <span className="flex-1 truncate text-sm">{conversation.title}</span>
            {longPressId === conversation.id && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteConversation(conversation.id)
                  setLongPressId(null)
                }}
                className="p-1 bg-red-500/20 hover:bg-red-500/30 rounded transition-colors"
              >
                <Trash2 size={16} className="text-red-500" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
