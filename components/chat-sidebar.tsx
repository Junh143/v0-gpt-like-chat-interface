"use client"

import { Plus, MessageSquare, MoreHorizontal, Trash2, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ChatHistory {
  id: string
  title: string
  date: string
}

interface ChatSidebarProps {
  chatHistory: ChatHistory[]
  activeChatId: string | null
  onNewChat: () => void
  onSelectChat: (id: string) => void
  onDeleteChat: (id: string) => void
}

export function ChatSidebar({ chatHistory, activeChatId, onNewChat, onSelectChat, onDeleteChat }: ChatSidebarProps) {
  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-full">
      <div className="p-3">
        <Button
          onClick={onNewChat}
          variant="outline"
          className="w-full justify-start gap-2 bg-transparent border-sidebar-border hover:bg-sidebar-accent text-sidebar-foreground"
        >
          <Plus className="h-4 w-4" />새 채팅
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        <div className="space-y-1">
          {chatHistory.map((chat) => (
            <div
              key={chat.id}
              className={`group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                activeChatId === chat.id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
              }`}
              onClick={() => onSelectChat(chat.id)}
            >
              <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="flex-1 truncate text-sm">{chat.title}</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-popover">
                  <DropdownMenuItem className="gap-2">
                    <Edit2 className="h-4 w-4" />
                    이름 변경
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="gap-2 text-destructive"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteChat(chat.id)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                    삭제
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </div>

      <div className="p-3 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-medium text-sm">
            U
          </div>
          <span className="text-sm text-sidebar-foreground">사용자</span>
        </div>
      </div>
    </aside>
  )
}
