"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import ChatSidebar from "@/components/chat-sidebar"
import ChatMessages from "@/components/chat-messages"
import LanguageSelector from "@/components/language-selector"
import VoiceChat from "@/components/voice-chat"
import DevSettings from "@/components/dev-settings"
import AICamera from "@/components/ai-camera"
import MusicSearch from "@/components/music-search"
import { generateAIResponse } from "@/lib/ai"
import { Menu, X } from "lucide-react"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
}

interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: number
  type?: "chat" | "learn"
  language?: string
  detectedLanguage?: string
}

export default function ChatInterface() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showLanguageSelector, setShowLanguageSelector] = useState(false)
  const [showVoiceChat, setShowVoiceChat] = useState(false)
  const [showDevSettings, setShowDevSettings] = useState(false)
  const [showAICamera, setShowAICamera] = useState(false)
  const [showMusicSearch, setShowMusicSearch] = useState(false)
  const [customSystemPrompt, setCustomSystemPrompt] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const playNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const now = audioContext.currentTime

      const osc1 = audioContext.createOscillator()
      const osc2 = audioContext.createOscillator()
      const gain = audioContext.createGain()

      osc1.frequency.value = 528
      osc2.frequency.value = 624
      osc1.type = "sine"
      osc2.type = "sine"

      gain.gain.setValueAtTime(0.3, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6)

      osc1.connect(gain)
      osc2.connect(gain)
      gain.connect(audioContext.destination)

      osc1.start(now)
      osc2.start(now)
      osc1.stop(now + 0.6)
      osc2.stop(now + 0.6)
    } catch (e) {
      console.log("오디오 컨텍스트 오류")
    }
  }

  useEffect(() => {
    const saved = localStorage.getItem("conversations")
    if (saved) {
      setConversations(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("conversations", JSON.stringify(conversations))
  }, [conversations])

  useEffect(() => {
    if (currentConversationId) {
      const conversation = conversations.find((c) => c.id === currentConversationId)
      if (conversation) {
        setMessages(conversation.messages)
      }
    } else {
      setMessages([])
    }
  }, [currentConversationId, conversations])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      createdAt: Date.now(),
      type: "chat",
    }
    setConversations([newConversation, ...conversations])
    setCurrentConversationId(newConversation.id)
    setMessages([])
  }

  const createLanguageLearningConversation = (languageId: string) => {
    const languageNames: Record<string, string> = {
      english: "English",
      korean: "한국어",
      chinese: "中文",
      spanish: "Español",
      french: "Français",
      japanese: "日本語",
      german: "Deutsch",
    }

    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: `${languageNames[languageId]} 배우기`,
      messages: [],
      createdAt: Date.now(),
      type: "learn",
      language: languageId,
    }
    setConversations([newConversation, ...conversations])
    setCurrentConversationId(newConversation.id)
    setMessages([])
    setShowLanguageSelector(false)
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !currentConversationId) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput("")
    setIsLoading(true)

    try {
      const conversation = conversations.find((c) => c.id === currentConversationId)
      const isLearning = conversation?.type === "learn"
      let language = conversation?.language || conversation?.detectedLanguage || "auto"

      if (isLearning === false && messages.length === 0) {
        language = "auto"
      }

      const aiResponse = await generateAIResponse(input, isLearning, language)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: aiResponse,
      }
      const updatedMessages = [...newMessages, assistantMessage]
      setMessages(updatedMessages)

      playNotificationSound()

      setConversations(
        conversations.map((c) =>
          c.id === currentConversationId
            ? {
                ...c,
                messages: updatedMessages,
                title: c.messages.length === 0 ? input.slice(0, 30) : c.title,
                detectedLanguage: messages.length === 0 && language === "auto" ? language : c.detectedLanguage,
              }
            : c,
        ),
      )
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteConversation = (id: string) => {
    const filtered = conversations.filter((c) => c.id !== id)
    setConversations(filtered)
    if (currentConversationId === id) {
      setCurrentConversationId(filtered[0]?.id || null)
    }
  }

  const handleVoiceTranscript = (transcript: string) => {
    setInput(transcript)
    setSidebarOpen(false)
    setShowVoiceChat(false)
  }

  const handleDevSettingsSave = (prompt: string) => {
    setCustomSystemPrompt(prompt)
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <DevSettings isOpen={showDevSettings} onClose={() => setShowDevSettings(false)} onSave={handleDevSettingsSave} />
      <AICamera isOpen={showAICamera} onClose={() => setShowAICamera(false)} />
      <MusicSearch isOpen={showMusicSearch} onClose={() => setShowMusicSearch(false)} />

      {showLanguageSelector && (
        <LanguageSelector
          onSelect={createLanguageLearningConversation}
          onClose={() => setShowLanguageSelector(false)}
        />
      )}

      <VoiceChat isOpen={showVoiceChat} onClose={() => setShowVoiceChat(false)} onTranscript={handleVoiceTranscript} />

      <div className="hidden md:flex md:flex-col w-64 border-r border-border bg-card overflow-hidden">
        <ChatSidebar
          conversations={conversations}
          currentConversationId={currentConversationId}
          onSelectConversation={(id) => {
            setCurrentConversationId(id)
            setSidebarOpen(false)
          }}
          onNewConversation={() => {
            createNewConversation()
            setSidebarOpen(false)
          }}
          onDeleteConversation={deleteConversation}
          onLearnLanguage={() => {
            setShowLanguageSelector(true)
            setSidebarOpen(false)
          }}
          onVoiceChat={() => {
            setShowVoiceChat(true)
            setSidebarOpen(false)
          }}
          onAICamera={() => {
            setShowAICamera(true)
            setSidebarOpen(false)
          }}
          onMusicSearch={() => {
            setShowMusicSearch(true)
            setSidebarOpen(false)
          }}
          onDevSettings={() => {
            setShowDevSettings(true)
            setSidebarOpen(false)
          }}
        />
      </div>

      {sidebarOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)} />
          <div className="fixed left-0 top-0 h-full z-50 md:hidden">
            <ChatSidebar
              conversations={conversations}
              currentConversationId={currentConversationId}
              onSelectConversation={(id) => {
                setCurrentConversationId(id)
                setSidebarOpen(false)
              }}
              onNewConversation={() => {
                createNewConversation()
                setSidebarOpen(false)
              }}
              onDeleteConversation={deleteConversation}
              onLearnLanguage={() => {
                setShowLanguageSelector(true)
                setSidebarOpen(false)
              }}
              onVoiceChat={() => {
                setShowVoiceChat(true)
                setSidebarOpen(false)
              }}
              onAICamera={() => {
                setShowAICamera(true)
                setSidebarOpen(false)
              }}
              onMusicSearch={() => {
                setShowMusicSearch(true)
                setSidebarOpen(false)
              }}
              onDevSettings={() => {
                setShowDevSettings(true)
                setSidebarOpen(false)
              }}
            />
          </div>
        </>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-3 border-b border-border bg-card flex items-center md:hidden">
          <Button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            variant="ghost"
            size="icon"
            className="text-foreground hover:bg-muted"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>

        {currentConversationId ? (
          <>
            <ChatMessages messages={messages} isLoading={isLoading} ref={messagesEndRef} />

            <form onSubmit={handleSendMessage} className="p-4 bg-background flex justify-center">
              <div className="w-full max-w-2xl flex gap-2 bg-card border border-border rounded-full shadow-lg px-4 py-2 items-center">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="메시지를 입력하세요..."
                  className="bg-transparent border-0 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-0 flex-1 py-2 font-sans tracking-wide leading-relaxed"
                  rows={1}
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  size="icon"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full flex-shrink-0"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5.951-1.429 5.951 1.429a1 1 0 001.169-1.409l-7-14z" />
                  </svg>
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            좌측 메뉴에서 새 채팅을 시작하세요
          </div>
        )}
      </div>
    </div>
  )
}
