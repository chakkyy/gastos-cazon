'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface YearMonthSelectorProps {
  selectedYear: number
  selectedMonth: number
  availableYears: number[]
  availableMonths: { year: number; month: number }[]
  onYearChange: (year: number) => void
  onMonthChange: (month: number) => void
}

const MONTH_NAMES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
]

export function YearMonthSelector({
  selectedYear,
  selectedMonth,
  availableYears,
  availableMonths,
  onYearChange,
  onMonthChange,
}: YearMonthSelectorProps) {
  const monthsForYear = availableMonths
    .filter((m) => m.year === selectedYear)
    .map((m) => m.month)
    .sort((a, b) => a - b)

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
      <Select value={selectedYear.toString()} onValueChange={(v) => onYearChange(Number(v))}>
        <SelectTrigger className="w-full sm:w-32 rounded-full border-border/40 bg-card/70 shadow-sm backdrop-blur-sm hover:bg-card/90 transition-all">
          <SelectValue placeholder="Año" />
        </SelectTrigger>
        <SelectContent>
          {availableYears.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedMonth.toString()} onValueChange={(v) => onMonthChange(Number(v))}>
        <SelectTrigger className="w-full sm:w-40 rounded-full border-border/40 bg-card/70 shadow-sm backdrop-blur-sm hover:bg-card/90 transition-all">
          <SelectValue placeholder="Mes" />
        </SelectTrigger>
        <SelectContent>
          {monthsForYear.map((month) => (
            <SelectItem key={month} value={month.toString()}>
              {MONTH_NAMES[month - 1]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
