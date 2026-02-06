'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency } from '@/lib/calculations'
import { SparklesText } from '@/components/magicui/sparkles-text'
import { BorderBeam } from '@/components/magicui/border-beam'
import { AuroraText } from '@/components/magicui/aurora-text'
import { colors } from '@/lib/design-tokens'
import { motion } from 'motion/react'

interface ExpensesTableProps {
  categories: Record<string, number>
  enabledCategories: Set<string>
  total?: number
  onToggle: (category: string, enabled: boolean) => void
}

export function ExpensesTable({ categories, enabledCategories, total, onToggle }: ExpensesTableProps) {
  const rows = Object.entries(categories)

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
          <SparklesText
            sparklesCount={4}
            colors={{ first: colors.plant, second: colors.beigeDark }}
            className="text-base font-semibold !font-semibold"
          >
            Tabla de gastos
          </SparklesText>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[65%]">Gasto</TableHead>
              <TableHead className="text-right">Monto</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} className="py-6 text-center text-muted-foreground">
                  No hay gastos disponibles.
                </TableCell>
              </TableRow>
            )}
            {rows.map(([category, amount]) => {
              const enabled = enabledCategories.has(category)
              return (
                <motion.tr
                  key={category}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onToggle(category, !enabled)}
                  className={`cursor-pointer select-none border-b transition-all duration-200 hover:bg-primary/5 ${
                    enabled ? 'opacity-100' : 'opacity-40'
                  }`}
                >
                  <TableCell className="font-medium text-foreground">
                    <span className={`transition-all duration-200 ${!enabled ? 'line-through decoration-foreground/40' : ''}`}>
                      {category}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm text-foreground/90">
                    <span className={`transition-all duration-200 ${!enabled ? 'line-through decoration-foreground/40' : ''}`}>
                      {formatCurrency(amount)}
                    </span>
                  </TableCell>
                </motion.tr>
              )
            })}
          </TableBody>
          {total !== undefined && (
            <TableFooter>
              <TableRow className="border-t-2 border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 hover:bg-primary/10">
                <TableCell className="font-bold text-foreground text-base">Total</TableCell>
                <TableCell className="text-right font-mono font-bold text-base">
                  <AuroraText
                    colors={[colors.plant, colors.olive, colors.plantDark, colors.beigeDark]}
                    speed={1.5}
                    className="font-bold"
                  >
                    {formatCurrency(total)}
                  </AuroraText>
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
        <p className="text-xs text-muted-foreground text-center pt-1">
          Tocá un gasto para quitarlo del total
        </p>
      </CardContent>
    </Card>
  )
}
