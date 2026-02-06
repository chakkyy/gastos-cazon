'use client'

import { AnimatedThemeToggler } from '@/components/magicui/animated-theme-toggler'
import { ShineBorder } from '@/components/magicui/shine-border'
import { colors } from '@/lib/design-tokens'

export function ThemeToggle() {
  return (
    <div className="relative rounded-full">
      <ShineBorder
        borderWidth={1}
        shineColor={[colors.plant, colors.beigeDark, colors.olive]}
        className="rounded-full"
      />
      <AnimatedThemeToggler
        type="button"
        className="relative flex h-11 w-11 items-center justify-center rounded-full border border-border/70 bg-background/80 text-foreground shadow-sm transition hover:shadow-md"
        aria-label="Cambiar tema"
      />
    </div>
  )
}
