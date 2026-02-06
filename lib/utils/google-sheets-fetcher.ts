import type { MonthlyExpense } from '../types';

const SPREADSHEET_ID =
  process.env.NEXT_PUBLIC_GOOGLE_SHEETS_SPREADSHEET_ID ||
  '1CX3g0sYAOuKGAHODU79KIOyEtKag0Aq9D6b3sGUJf88';
const SHEET_RANGE =
  process.env.NEXT_PUBLIC_GOOGLE_SHEETS_RANGE || 'Hoja 1!A1:Z100';
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY;

interface SheetResponse {
  values: string[][];
}

const normalizeNumberString = (raw: string) => {
  const trimmed = String(raw).trim();
  if (!trimmed) return '';

  const sanitized = trimmed.replace(/[^0-9,.-]/g, '');
  if (!sanitized) return '';

  const isNegative = sanitized.startsWith('-');
  const unsigned = sanitized.replace(/-/g, '');
  const hasComma = unsigned.includes(',');
  const hasDot = unsigned.includes('.');
  let normalized = unsigned;

  if (hasComma && hasDot) {
    normalized = unsigned.replace(/\./g, '').replace(/,/g, '.');
  } else if (hasComma) {
    normalized = unsigned.replace(/,/g, '.');
  } else if (hasDot) {
    const parts = unsigned.split('.');
    if (parts.length > 2) {
      normalized = unsigned.replace(/\./g, '');
    } else {
      const [whole, fraction] = parts;
      if (fraction.length === 3 && whole.length > 0) {
        normalized = `${whole}${fraction}`;
      } else {
        normalized = unsigned;
      }
    }
  }

  return isNegative ? `-${normalized}` : normalized;
};

const parseSheetNumber = (
  raw: string | number | undefined | null
) => {
  if (raw === undefined || raw === null) return undefined;
  if (typeof raw === 'number') {
    return Number.isFinite(raw) ? raw : undefined;
  }
  const normalized = normalizeNumberString(raw);
  if (!normalized) return undefined;
  const value = Number.parseFloat(normalized);
  return Number.isNaN(value) ? undefined : value;
};

const parseCategoryValue = (raw: string | number | undefined) => {
  const value = parseSheetNumber(raw);
  return value === undefined ? 0 : value;
};

const parseOptionalNumber = (raw: string | number | undefined) => {
  return parseSheetNumber(raw);
};

/**
 * Parses Google Sheets API response into MonthlyExpense array
 * @param values - 2D array of cell values from Google Sheets
 * @returns Array of parsed monthly expenses
 */
function parseSheetData(values: string[][]): MonthlyExpense[] {
  if (!values || values.length < 2) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('No data found in sheet');
    }
    return [];
  }

  // First row is headers
  const headers = values[0].map((h) => h?.trim() || '');

  // Find column indices
  const yearIdx = headers.findIndex(
    (h) => h.toLowerCase() === 'year'
  );
  const monthIdx = headers.findIndex(
    (h) => h.toLowerCase() === 'month'
  );
  const notesIdx = headers.findIndex(
    (h) => h.toLowerCase() === 'notes'
  );
  const totalIdx = headers.findIndex(
    (h) => h.toLowerCase() === 'total'
  );

  if (yearIdx === -1 || monthIdx === -1) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Missing required columns: Year or Month');
    }
    return [];
  }

  // Identify category columns (exclude Year, Month, Notes, and Total columns)
  const categoryIndices: number[] = [];
  const categoryNames: string[] = [];

  headers.forEach((header, idx) => {
    if (
      idx !== yearIdx &&
      idx !== monthIdx &&
      idx !== notesIdx &&
      idx !== totalIdx &&
      header.length > 0
    ) {
      categoryIndices.push(idx);
      categoryNames.push(header);
    }
  });

  if (process.env.NODE_ENV === 'development') {
    console.log('Found categories:', categoryNames);
  }

  // Parse data rows
  const expenses: MonthlyExpense[] = [];

  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    if (!row || row.length === 0) continue;

    const year = parseInt(row[yearIdx]);
    const month = parseInt(row[monthIdx]);

    // Skip rows with invalid year or month
    if (isNaN(year) || isNaN(month)) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Skipping row ${i + 1}: Invalid year or month`);
      }
      continue;
    }

    // Parse categories
    const categories: Record<string, number> = {};

    categoryIndices.forEach((idx, i) => {
      categories[categoryNames[i]] = parseCategoryValue(row[idx]);
    });

    // Create expense object
    const expense: MonthlyExpense = {
      year,
      month,
      categories,
    };

    // Add total if present
    if (totalIdx !== -1) {
      const totalValue = parseOptionalNumber(row[totalIdx]);
      if (totalValue !== undefined) {
        expense.total = totalValue;
      }
    }

    // Add notes if present
    if (notesIdx !== -1 && row[notesIdx]) {
      expense.notes = row[notesIdx].trim();
    }

    expenses.push(expense);
  }

  if (process.env.NODE_ENV === 'development') {
    console.log(`Parsed ${expenses.length} expense records`);
  }
  return expenses;
}

/**
 * Fetches expense data from Google Sheets using API v4
 * @returns Promise resolving to array of monthly expenses
 * @throws Error if API key is missing or fetch fails
 */
export async function fetchGoogleSheetsData(): Promise<
  MonthlyExpense[]
> {
  if (!API_KEY) {
    throw new Error(
      'Google Sheets API key not configured. Please set NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY in .env.local'
    );
  }

  if (!SPREADSHEET_ID) {
    throw new Error(
      'Google Sheets Spreadsheet ID not configured. Please set NEXT_PUBLIC_GOOGLE_SHEETS_SPREADSHEET_ID in .env.local'
    );
  }

  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(
      SHEET_RANGE
    )}?key=${API_KEY}`;

    if (process.env.NODE_ENV === 'development') {
      console.log('Fetching data from Google Sheets...');
    }
    const response = await fetch(url);

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: { message: response.statusText } }));
      throw new Error(
        `Failed to fetch sheet: ${
          error.error?.message || response.statusText
        }`
      );
    }

    const data: SheetResponse = await response.json();
    const expenses = parseSheetData(data.values);

    // Sort by year and month (descending for most recent first)
    expenses.sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });

    if (process.env.NODE_ENV === 'development') {
      console.log(
        'Successfully fetched and parsed Google Sheets data'
      );
    }
    return expenses;
  } catch (error) {
    // Always log errors, but format them for production
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching Google Sheets data:', error);
    }
    throw new Error(
      `Failed to fetch Google Sheets data: ${errorMessage}`
    );
  }
}
