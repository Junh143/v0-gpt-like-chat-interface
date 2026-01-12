import { Sparkles, Code, BookOpen, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"

export function EmptyState() {
  const suggestions = [
    { icon: Code, label: "코드 작성 도움" },
    { icon: BookOpen, label: "개념 설명" },
    { icon: Lightbulb, label: "아이디어 브레인스토밍" },
  ]

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-8 px-4 bg-chat-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-accent" />
        </div>
        <h1 className="text-2xl font-semibold text-foreground">무엇을 도와드릴까요?</h1>
        <p className="text-muted-foreground text-center max-w-md">질문을 입력하거나 아래 추천 주제를 선택해주세요</p>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {suggestions.map((item) => (
          <Button
            key={item.label}
            variant="outline"
            className="gap-2 bg-secondary/50 border-border/50 hover:bg-secondary hover:border-border"
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
