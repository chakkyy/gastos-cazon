export interface MonthlyExpense {
  year: number
  month: number // 1-12
  categories: Record<string, number> // category name -> amount
  total?: number // optional Total column from sheet
  notes?: string
}
