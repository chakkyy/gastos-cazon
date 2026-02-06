'use client'

import * as React from 'react'

import { Card } from '@/components/ui/card'
import { ShineBorder } from '@/components/magicui/shine-border'
import { cn } from '@/lib/utils'
import { colors } from '@/lib/design-tokens'

interface OrganicCardProps extends React.ComponentProps<typeof Card> {
  shineColor?: string | string[]
  borderWidth?: number
}

export function OrganicCard({
  className,
  shineColor = [colors.beigeDark, colors.plant, colors.olive],
  borderWidth = 1,
  children,
  ...props
}: OrganicCardProps) {
  return (
    <div className="relative rounded-[2rem]">
      <ShineBorder
        borderWidth={borderWidth}
        shineColor={shineColor}
        className="rounded-[2rem]"
      />
      <Card
        className={cn(
          'relative rounded-[2rem] border border-border/70 bg-card/90 shadow-sm backdrop-blur',
          className
        )}
        {...props}
      >
        {children}
      </Card>
    </div>
  )
}
