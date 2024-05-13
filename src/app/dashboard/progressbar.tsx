"use client"

import * as React from "react"

import { Progress } from "@/components/ui/progress"

export function Progressbar() {
  const [progress, setProgress] = React.useState(13)

  React.useEffect(() => {
    const timer1 = setTimeout(() => {
      setProgress(66)
    }, 1000) // Define o progresso como 66 após 1000ms (1 segundo)

    const timer2 = setTimeout(() => {
      setProgress(99)
    }, 1900) // Define o progresso como 99 após 2500ms (2,5 segundos)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  return (
    <div className="flex justify-center items-center h-screen">
      <Progress value={progress} className="w-[60%]" />
    </div>
  )
}