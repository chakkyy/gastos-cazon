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
import { CATEGORY_PALETTE } from '@/lib/palette'

interface ExpensesTableProps {
  categories: Record<string, number>
  enabledCategories: Set<string>
  total?: number
}

export function ExpensesTable({ categories, enabledCategories, total }: ExpensesTableProps) {
  const allKeys = Object.keys(categories)
  const rows = Object.entries(categories).filter(([category]) => enabledCategories.has(category))

  return (
    <Card className="border border-border/50 bg-card/90 shadow-sm backdrop-blur rounded-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-foreground">Tabla de gastos</CardTitle>
      </CardHeader>
      <CardContent>
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
                  No hay gastos habilitados.
                </TableCell>
              </TableRow>
            )}
            {rows.map(([category, amount]) => {
              const colorIndex = allKeys.indexOf(category)
              return (
                <TableRow key={category} className="hover:bg-primary/5 transition-colors">
                  <TableCell className="font-medium text-foreground">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="inline-block h-2 w-2 rounded-full shrink-0"
                        style={{ backgroundColor: CATEGORY_PALETTE[colorIndex % CATEGORY_PALETTE.length] }}
                      />
                      {category}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm text-foreground/90">
                    {formatCurrency(amount)}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
          {rows.length > 0 && total !== undefined && (
            <TableFooter>
              <TableRow className="border-t-2 border-primary/15 bg-primary/5 hover:bg-primary/5">
                <TableCell className="font-semibold text-foreground">Total</TableCell>
                <TableCell className="text-right font-mono text-sm font-semibold text-foreground">
                  {formatCurrency(total)}
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </CardContent>
    </Card>
  )
}
