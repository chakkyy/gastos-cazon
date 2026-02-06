'use client'

import { MagicCard } from '@/components/magicui/magic-card'
import { NumberTicker } from '@/components/magicui/number-ticker'
import { formatCurrency } from '@/lib/calculations'
import { colors } from '@/lib/design-tokens'
import { Wallet, Crown } from 'lucide-react'

interface KpiSummaryProps {
  totalExpenses: number
  sheetTotal?: number
  topExpense?: { name: string; amount: number } | null
}

export function KpiSummary({ totalExpenses, sheetTotal, topExpense }: KpiSummaryProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <MagicCard
        gradientColor={`${colors.plant}0f`}
        gradientFrom={`${colors.plant}4d`}
        gradientTo={`${colors.beigeDark}33`}
        gradientOpacity={0.4}
        className="rounded-2xl border border-border/20"
      >
        <div className="p-5 space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15">
              <Wallet className="h-4 w-4 text-primary" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Total seleccionado</p>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg text-muted-foreground font-serif">$</span>
            <NumberTicker
              key={totalExpenses}
              value={totalExpenses}
              damping={30}
              stiffness={200}
              className="text-3xl font-semibold text-foreground font-serif tabular-nums tracking-tight"
            />
          </div>
          {sheetTotal !== undefined && (
            <p className="text-sm text-muted-foreground">
              Total de la hoja: <span className="font-medium text-foreground">{formatCurrency(sheetTotal)}</span>
            </p>
          )}
        </div>
      </MagicCard>

      <MagicCard
        gradientColor={`${colors.olive}0f`}
        gradientFrom={`${colors.olive}4d`}
        gradientTo={`${colors.plant}33`}
        gradientOpacity={0.4}
        className="rounded-2xl border border-border/20"
      >
        <div className="p-5 space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/15">
              <Crown className="h-4 w-4 text-secondary" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Gasto más alto</p>
          </div>
          {topExpense ? (
            <div className="space-y-1">
              <p className="text-xl font-semibold text-foreground font-serif">
                {topExpense.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatCurrency(topExpense.amount)}
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No hay gastos habilitados.</p>
          )}
        </div>
      </MagicCard>
    </div>
  )
}
