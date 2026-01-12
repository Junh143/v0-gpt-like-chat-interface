"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { X } from "lucide-react"

interface MusicSearchProps {
  isOpen: boolean
  onClose: () => void
}

export default function MusicSearch({ isOpen, onClose }: MusicSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/music-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      })
      const data = await response.json()
      setResults(data.result)
    } catch (error) {
      setResults("음악 검색 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-lg transition-all duration-300">
      <div className="bg-card rounded-3xl shadow-2xl w-full max-w-md mx-4 p-6 border border-border animate-in fade-in scale-95 duration-300">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">🎵 음악 검색</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg transition-colors">
            <X size={20} className="text-foreground" />
          </button>
        </div>

        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">노래 제목 또는 아티스트 검색</label>
            <Textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="예: Bohemian Rhapsody, Taylor Swift..."
              className="bg-background border border-border text-foreground rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows={3}
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg py-2 font-medium transition-all"
          >
            {isLoading ? "검색 중..." : "검색"}
          </Button>
        </form>

        {results && (
          <div className="mt-4 p-4 bg-background rounded-lg border border-border max-h-64 overflow-y-auto">
            <p className="text-sm text-foreground whitespace-pre-wrap">{results}</p>
          </div>
        )}
      </div>
    </div>
  )
}
