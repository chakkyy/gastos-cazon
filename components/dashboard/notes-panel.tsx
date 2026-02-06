'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AnimatedShinyText } from '@/components/magicui/animated-shiny-text'
import { NotebookPen } from 'lucide-react'

interface NotesPanelProps {
  notes?: string
}

export function NotesPanel({ notes }: NotesPanelProps) {
  if (!notes) return null

  return (
    <Card className="border border-border/50 bg-card/70 shadow-sm backdrop-blur rounded-2xl overflow-hidden">
      <div className="border-l-[3px] border-primary/30">
        <CardHeader className="pb-2 pl-6">
          <CardTitle className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
            <NotebookPen className="h-4 w-4 text-primary" />
            <AnimatedShinyText shimmerWidth={80}>Notas</AnimatedShinyText>
          </CardTitle>
        </CardHeader>
        <CardContent className="pl-6">
          <p className="text-sm leading-relaxed text-foreground/85 italic whitespace-pre-wrap">{notes}</p>
        </CardContent>
      </div>
    </Card>
  )
}
