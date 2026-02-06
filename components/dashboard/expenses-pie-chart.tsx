'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Pie, PieChart, Cell } from 'recharts'
import { formatCurrency } from '@/lib/calculations'
import { CATEGORY_PALETTE } from '@/lib/palette'
import { BorderBeam } from '@/components/magicui/border-beam'
import { colors } from '@/lib/design-tokens'
import { PieChart as PieIcon } from 'lucide-react'

interface ExpensesPieChartProps {
  categories: { name: string; value: number }[]
  highlight?: { name: string; amount: number } | null
}

export function ExpensesPieChart({ categories, highlight }: ExpensesPieChartProps) {
  const data = categories.filter((item) => item.value > 0)
  const total = data.reduce((sum, item) => sum + item.value, 0)

  const chartConfig = data.reduce<Record<string, { label: string; color: string }>>((acc, item, index) => {
    acc[item.name] = {
      label: item.name,
      color: CATEGORY_PALETTE[index % CATEGORY_PALETTE.length],
    }
    return acc
  }, {})

  return (
    <Card className="relative overflow-hidden border border-border/50 bg-card/90 shadow-sm backdrop-blur rounded-2xl">
      <BorderBeam
        size={120}
        duration={8}
        colorFrom={colors.plant}
        colorTo={colors.beigeDark}
        borderWidth={1.5}
      />
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
            <PieIcon className="h-3.5 w-3.5 text-primary" />
          </div>
          Distribución de gastos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/50 bg-background/70 px-6 py-10 text-center text-sm text-muted-foreground">
            No hay gastos habilitados para graficar.
          </div>
        ) : (
          <div className="relative">
            <ChartContainer config={chartConfig} className="h-64 w-full aspect-[4/3]">
              <PieChart>
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name) => (
                        <div className="flex w-full items-center justify-between gap-4">
                          <span className="text-muted-foreground">{name}</span>
                          <span className="text-foreground font-medium">{formatCurrency(Number(value))}</span>
                        </div>
                      )}
                    />
                  }
                />
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  strokeWidth={2}
                >
                  {data.map((entry, index) => {
                    const isHighlight = highlight?.name === entry.name
                    return (
                      <Cell
                        key={entry.name}
                        fill={CATEGORY_PALETTE[index % CATEGORY_PALETTE.length]}
                        stroke={isHighlight ? colors.olive : 'rgba(255,255,255,0.6)'}
                        strokeWidth={isHighlight ? 3 : 1}
                      />
                    )
                  })}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="rounded-full bg-card/90 px-5 py-3 text-center backdrop-blur-sm shadow-sm border border-border/40">
                <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-medium">Total</p>
                <p className="text-sm font-semibold text-foreground font-serif">{formatCurrency(total)}</p>
              </div>
            </div>
          </div>
        )}

        {highlight && (
          <div className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3">
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-medium">Más alto</p>
            <p className="text-sm font-semibold text-foreground">{highlight.name}</p>
            <p className="text-xs text-muted-foreground">{formatCurrency(highlight.amount)}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
