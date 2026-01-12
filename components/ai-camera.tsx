"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface AICameraProps {
  isOpen: boolean
  onClose: () => void
}

export default function AICamera({ isOpen, onClose }: AICameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [description, setDescription] = useState("카메라를 시작하면 물체를 인식합니다...")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const analysisIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!isOpen) return

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          setIsRunning(true)
        }
      } catch (error) {
        console.error("[v0] 카메라 접근 오류:", error)
        setDescription("카메라를 사용할 수 없습니다")
      }
    }

    startCamera()

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach((track) => track.stop())
      }
      if (analysisIntervalRef.current) {
        clearInterval(analysisIntervalRef.current)
      }
    }
  }, [isOpen])

  const analyzeFrame = async () => {
    if (!canvasRef.current || !videoRef.current || isAnalyzing) return

    setIsAnalyzing(true)
    try {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      ctx.drawImage(videoRef.current, 0, 0)

      // 이미지를 base64로 변환
      const imageData = canvas.toDataURL("image/jpeg")

      // AI에게 이미지 분석 요청
      const response = await fetch("/api/vision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData }),
      })

      if (!response.ok) {
        throw new Error("Vision API 오류")
      }

      const data = await response.json()
      setDescription(data.description || "분석 중...")

      // 텍스트 음성 변환으로 설명 재생
      try {
        const utterance = new SpeechSynthesisUtterance(data.description)
        utterance.lang = "ko-KR"
        speechSynthesis.cancel()
        speechSynthesis.speak(utterance)
      } catch (e) {
        console.log("[v0] 음성 재생 오류")
      }
    } catch (error) {
      console.error("[v0] 프레임 분석 오류:", error)
      setDescription("분석 중 오류가 발생했습니다")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const toggleAnalysis = () => {
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current)
      analysisIntervalRef.current = null
      setDescription("분석 중지됨")
    } else {
      analyzeFrame() // 즉시 한 번 분석
      analysisIntervalRef.current = setInterval(analyzeFrame, 2000) // 2초마다 분석
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-lg flex items-center justify-center p-4">
      <div className="bg-card rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-border">
        <div className="bg-gradient-to-r from-primary to-primary/80 p-4 flex items-center justify-between">
          <h2 className="text-white font-bold text-lg">AI 카메라</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <X size={20} className="text-white" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="relative bg-black rounded-2xl overflow-hidden aspect-video">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <canvas ref={canvasRef} className="hidden" />
            {isAnalyzing && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <div className="text-white text-sm font-semibold">분석 중...</div>
              </div>
            )}
          </div>

          <div className="bg-muted rounded-2xl p-4 min-h-24 flex items-center justify-center">
            <p className="text-center text-foreground text-sm leading-relaxed font-sans">{description}</p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={toggleAnalysis}
              className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold py-2 rounded-full transition-all"
            >
              {analysisIntervalRef.current ? "분석 중지" : "분석 시작"}
            </Button>
            <Button onClick={onClose} variant="outline" className="flex-1 py-2 rounded-full bg-transparent">
              종료
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
