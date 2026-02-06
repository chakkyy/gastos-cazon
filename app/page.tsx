'use client';

import { useState, useEffect, useMemo } from 'react';
import { useFetchGastos } from '@/lib/hooks/use-fetch-gastos';
import { getMonthName } from '@/lib/calculations';
import { YearMonthSelector } from '@/components/dashboard/year-month-selector';
import { CategoryToggles } from '@/components/dashboard/category-toggles';
import { KpiSummary } from '@/components/dashboard/kpi-summary';
import { ExpensesPieChart } from '@/components/dashboard/expenses-pie-chart';
import { ExpensesTable } from '@/components/dashboard/expenses-table';
import { NotesPanel } from '@/components/dashboard/notes-panel';
import { BlurFade } from '@/components/magicui/blur-fade';
import { ThemeToggle } from '@/components/theme-toggle';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { data, loading, error } = useFetchGastos();

  // Get latest month as default
  const latestMonth = useMemo(() => {
    if (data.length === 0) return null;
    return data.reduce((latest, current) => {
      if (current.year > latest.year) return current;
      if (
        current.year === latest.year &&
        current.month > latest.month
      )
        return current;
      return latest;
    }, data[0]);
  }, [data]);

  const [selectedYear, setSelectedYear] = useState<number | null>(
    null
  );
  const [selectedMonth, setSelectedMonth] = useState<number | null>(
    null
  );

  useEffect(() => {
    if (
      latestMonth &&
      selectedYear === null &&
      selectedMonth === null
    ) {
      setSelectedYear(latestMonth.year);
      setSelectedMonth(latestMonth.month);
    }
  }, [latestMonth, selectedYear, selectedMonth]);

  // Get selected month data
  const selectedMonthData = useMemo(() => {
    if (selectedYear === null || selectedMonth === null) return null;
    return data.find(
      (d) => d.year === selectedYear && d.month === selectedMonth
    );
  }, [data, selectedYear, selectedMonth]);

  // Category toggles state
  const [enabledCategories, setEnabledCategories] = useState<
    Set<string>
  >(() => new Set());

  // Update enabled categories when month changes
  useEffect(() => {
    if (selectedMonthData) {
      setEnabledCategories(
        new Set(Object.keys(selectedMonthData.categories))
      );
    }
  }, [selectedMonthData]);

  const categoryEntries = useMemo(() => {
    if (!selectedMonthData) return [] as [string, number][];
    return Object.entries(selectedMonthData.categories);
  }, [selectedMonthData]);

  const enabledEntries = useMemo(() => {
    return categoryEntries.filter(([cat]) =>
      enabledCategories.has(cat)
    );
  }, [categoryEntries, enabledCategories]);

  const totalSelected = useMemo(() => {
    return enabledEntries.reduce((sum, [, amount]) => sum + amount, 0);
  }, [enabledEntries]);

  const topExpense = useMemo(() => {
    const filtered = enabledEntries.filter(([, amount]) => amount > 0);
    if (filtered.length === 0) return null;
    return filtered.reduce(
      (max, [name, amount]) =>
        amount > max.amount ? { name, amount } : max,
      { name: filtered[0][0], amount: filtered[0][1] }
    );
  }, [enabledEntries]);

  const pieData = useMemo(() => {
    return enabledEntries.map(([name, amount]) => ({
      name,
      value: amount,
    }));
  }, [enabledEntries]);

  // Available years and months
  const availableYears = useMemo(() => {
    return Array.from(new Set(data.map((d) => d.year))).sort(
      (a, b) => b - a
    );
  }, [data]);

  const availableMonths = useMemo(() => {
    const seen = new Set<string>();
    return data
      .filter((d) => {
        const key = `${d.year}-${d.month}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .map((d) => ({ year: d.year, month: d.month }));
  }, [data]);

  const handleToggleCategory = (
    category: string,
    enabled: boolean
  ) => {
    setEnabledCategories((prev) => {
      const next = new Set(prev);
      if (enabled) {
        next.add(category);
      } else {
        next.delete(category);
      }
      return next;
    });
  };

  if (loading || selectedYear === null || selectedMonth === null) {
    return (
      <div className="min-h-screen organic-canvas p-6">
        <BlurFade delay={0.05}>
          <div className="max-w-6xl mx-auto space-y-6">
            <Skeleton className="h-12 w-64 rounded-xl" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-64" />
              <Skeleton className="h-64" />
            </div>
          </div>
        </BlurFade>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen organic-canvas p-6">
        <div className="max-w-6xl mx-auto">
          <Alert variant="destructive">
            <AlertDescription className="flex items-center justify-between gap-4">
              <span>
                Error al cargar los datos de Google Sheets:{' '}
                {error.message}
              </span>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-destructive-foreground text-destructive rounded-md hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                Reintentar
              </button>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen organic-canvas">
      <div className="relative max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        <div className="pointer-events-none absolute -top-24 right-10 h-48 w-48 rounded-[60%_40%_50%_50%] bg-primary/12 blur-3xl" />
        <div className="pointer-events-none absolute top-32 -left-16 h-56 w-56 rounded-[45%_55%_60%_40%] bg-secondary/10 blur-3xl" />

        {/* Header */}
        <BlurFade delay={0.1}>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pb-4 border-b border-border/50">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-primary font-medium">
                  Vida en casa
                </span>
                <ThemeToggle />
              </div>
              <h1 className="text-4xl sm:text-5xl font-serif font-semibold tracking-tight text-foreground">
                Gastos del hogar
              </h1>
              <p className="text-muted-foreground text-base">
                {getMonthName(selectedMonth)} {selectedYear}
              </p>
            </div>
            <YearMonthSelector
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
              availableYears={availableYears}
              availableMonths={availableMonths}
              onYearChange={setSelectedYear}
              onMonthChange={setSelectedMonth}
            />
          </div>
        </BlurFade>

        {!selectedMonthData ? (
          <BlurFade delay={0.2}>
            <Alert className="border border-border/70 bg-card/80">
              <AlertDescription className="text-base">
                No hay datos disponibles para el mes seleccionado.
                Selecciona otro mes para ver los gastos.
              </AlertDescription>
            </Alert>
          </BlurFade>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-6">
            <div className="space-y-6">
              <BlurFade delay={0.2}>
                <KpiSummary
                  totalExpenses={totalSelected}
                  sheetTotal={selectedMonthData.total}
                  topExpense={topExpense}
                />
              </BlurFade>
              <BlurFade delay={0.3}>
                <ExpensesPieChart
                  categories={pieData}
                  highlight={topExpense}
                />
              </BlurFade>
              <BlurFade delay={0.35}>
                <CategoryToggles
                  categories={Object.keys(selectedMonthData.categories)}
                  enabledCategories={enabledCategories}
                  onToggle={handleToggleCategory}
                />
              </BlurFade>
            </div>
            <div className="space-y-6">
              <BlurFade delay={0.25}>
                <ExpensesTable
                  categories={selectedMonthData.categories}
                  enabledCategories={enabledCategories}
                  total={totalSelected}
                />
              </BlurFade>
              <BlurFade delay={0.4}>
                <NotesPanel notes={selectedMonthData.notes} />
              </BlurFade>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
