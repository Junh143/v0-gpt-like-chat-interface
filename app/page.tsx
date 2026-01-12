"use client"

import { useState, useRef, useEffect } from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ChatSidebar } from "@/components/chat-sidebar"
import { ChatMessage } from "@/components/chat-message"
import { ChatInput } from "@/components/chat-input"
import { EmptyState } from "@/components/empty-state"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

interface Chat {
  id: string
  title: string
  date: string
  messages: Message[]
}

export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [chats, setChats] = useState<Chat[]>([
    {
      id: "1",
      title: "React 컴포넌트 질문",
      date: "오늘",
      messages: [],
    },
    {
      id: "2",
      title: "TypeScript 타입 정의",
      date: "어제",
      messages: [],
    },
  ])
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const activeChat = chats.find((c) => c.id === activeChatId)

  const handleNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: "새 채팅",
      date: "오늘",
      messages: [],
    }
    setChats([newChat, ...chats])
    setActiveChatId(newChat.id)
  }

  const handleSelectChat = (id: string) => {
    setActiveChatId(id)
  }

  const handleDeleteChat = (id: string) => {
    setChats(chats.filter((c) => c.id !== id))
    if (activeChatId === id) {
      setActiveChatId(null)
    }
  }

  const handleSendMessage = (content: string) => {
    let currentChatId = activeChatId

    if (!activeChatId) {
      const newChat: Chat = {
        id: Date.now().toString(),
        title: content.slice(0, 30) + (content.length > 30 ? "..." : ""),
        date: "오늘",
        messages: [],
      }
      setChats([newChat, ...chats])
      setActiveChatId(newChat.id)
      currentChatId = newChat.id
    }

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
    }

    setChats((prevChats) =>
      prevChats.map((chat) => {
        if (chat.id === (currentChatId || prevChats[0]?.id)) {
          return {
            ...chat,
            title: chat.messages.length === 0 ? content.slice(0, 30) + (content.length > 30 ? "..." : "") : chat.title,
            messages: [...chat.messages, newUserMessage],
          }
        }
        return chat
      }),
    )

    setIsLoading(true)

    setTimeout(() => {
      const newAssistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `"${content}"에 대한 답변입니다. 이것은 데모 응답으로, 실제 AI 응답은 API 연동 후 표시됩니다.`,
      }

      setChats((prevChats) =>
        prevChats.map((chat) => {
          if (chat.id === (currentChatId || prevChats[0]?.id)) {
            return {
              ...chat,
              messages: [...chat.messages, newAssistantMessage],
            }
          }
          return chat
        }),
      )
      setIsLoading(false)
    }, 1500)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (activeChat?.messages.length) {
      scrollToBottom()
    }
  }, [activeChat?.messages.length])

  return (
    <div className="flex h-screen bg-background">
      {sidebarOpen && (
        <ChatSidebar
          chatHistory={chats.map((c) => ({ id: c.id, title: c.title, date: c.date }))}
          activeChatId={activeChatId}
          onNewChat={handleNewChat}
          onSelectChat={handleSelectChat}
          onDeleteChat={handleDeleteChat}
        />
      )}

      <div className="flex-1 flex flex-col">
        <header className="h-12 flex items-center px-4 gap-4 bg-background/80 backdrop-blur-xl border-b border-border/30">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-200"
          >
            <Menu className="h-4 w-4" />
          </Button>
          <span className="text-sm font-light text-muted-foreground">{activeChat?.title || ""}</span>
        </header>

        {!activeChat || activeChat.messages.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="flex-1 overflow-y-auto bg-black/70 scroll-smooth">
            <div className="flex flex-col gap-4 p-4">
              {activeChat.messages.map((message, index) => (
                <ChatMessage
                  key={message.id}
                  role={message.role}
                  content={message.content}
                  isLoading={isLoading && message.role === "assistant" && index === activeChat.messages.length - 1}
                />
              ))}
              {isLoading && activeChat.messages[activeChat.messages.length - 1]?.role === "user" && (
                <ChatMessage role="assistant" content="입력 중..." isLoading={true} />
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        <ChatInput onSend={handleSendMessage} disabled={isLoading} />
      </div>
    </div>
  )
}
