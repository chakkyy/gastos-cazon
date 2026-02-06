'use client'

import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CATEGORY_PALETTE } from '@/lib/palette'

interface CategoryTogglesProps {
  categories: string[]
  enabledCategories: Set<string>
  onToggle: (category: string, enabled: boolean) => void
}

export function CategoryToggles({ categories, enabledCategories, onToggle }: CategoryTogglesProps) {
  return (
    <Card className="border border-border/50 bg-card/85 shadow-sm backdrop-blur rounded-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-foreground">Activar gastos</CardTitle>
        <CardDescription>Apagá lo que no quieras ver en la tabla y el gráfico.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {categories.map((category, index) => (
            <div
              key={category}
              className="flex items-center justify-between gap-3 rounded-xl border border-border/40 bg-card/60 px-4 py-2.5 backdrop-blur-sm transition-all hover:bg-card/80 hover:shadow-sm"
            >
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: CATEGORY_PALETTE[index % CATEGORY_PALETTE.length] }}
                />
                <Label htmlFor={`toggle-${category}`} className="text-sm cursor-pointer flex-1 text-foreground/90 truncate">
                  {category}
                </Label>
              </div>
              <Switch
                id={`toggle-${category}`}
                checked={enabledCategories.has(category)}
                onCheckedChange={(checked) => onToggle(category, checked)}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
