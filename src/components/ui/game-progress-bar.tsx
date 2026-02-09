import { cn } from "@/lib/utils"

const heightClasses = {
  xs: "h-0.5",
  sm: "h-1.5",
  md: "h-2",
  lg: "h-3",
} as const

interface GameProgressBarProps {
  value: number
  max?: number
  color?: string
  height?: keyof typeof heightClasses
  previewValue?: number
  previewColor?: string
  className?: string
}

export function GameProgressBar({
  value,
  max = 100,
  color = "bg-stat-bar",
  height = "md",
  previewValue,
  previewColor = "bg-accent-gold/30",
  className,
}: GameProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  const previewPct = previewValue != null
    ? Math.min(100, Math.max(0, (previewValue / max) * 100))
    : undefined

  return (
    <div className={cn("w-full bg-bg-input rounded-full relative overflow-hidden", heightClasses[height], className)}>
      {previewPct != null && (
        <div
          className={cn("absolute inset-y-0 left-0 rounded-full transition-all", previewColor)}
          style={{ width: `${previewPct}%` }}
        />
      )}
      <div
        className={cn("h-full rounded-full transition-all relative", color)}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
