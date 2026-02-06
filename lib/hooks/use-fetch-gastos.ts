"use client"

import { useState, useEffect } from "react"
import type { MonthlyExpense } from "../types"
import { fetchGoogleSheetsData } from "../utils/google-sheets-fetcher"

export function useFetchGastos() {
  const [data, setData] = useState<MonthlyExpense[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)

        // Always fetch fresh data from Google Sheets
        const freshData = await fetchGoogleSheetsData()

        setData(freshData)
        setError(null)
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Failed to load data:', err)
        }
        setError(err instanceof Error ? err : new Error('Failed to fetch data'))
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return { data, loading, error }
}
