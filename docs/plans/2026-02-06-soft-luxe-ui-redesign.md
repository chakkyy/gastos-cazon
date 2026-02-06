# Soft & Luxe UI Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the household expense dashboard into a stunning, soft & luxe interface using Magic UI components — warm rosé/champagne tones, elegant animations, and premium micro-interactions that make daily expense tracking feel delightful.

**Architecture:** Keep all existing business logic and data flow unchanged. Replace the visual layer component-by-component: new color palette (warm rosé/champagne/sage), add Magic UI components (BlurFade, NumberTicker, MagicCard, BorderBeam, SparklesText), upgrade typography with Playfair Display + DM Sans, add staggered entrance animations and hover effects. The app remains fully functional throughout — each task is a self-contained visual upgrade.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS v4, Magic UI (from local monorepo), motion/react (new dependency), Recharts, shadcn/ui

---

### Task 1: Install motion/react dependency

**Files:**
- Modify: `package.json`

**Step 1: Install motion**

Run: `cd /Users/chako/Desktop/projects/yolo/gastos-mensuales-casa && pnpm add motion`

Expected: motion added to dependencies

**Step 2: Verify installation**

Run: `node -e "require('motion/react')"`

Expected: No errors

**Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add motion library for Magic UI animations"
```

---

### Task 2: Copy Magic UI components into the project

**Files:**
- Create: `components/magicui/blur-fade.tsx`
- Create: `components/magicui/number-ticker.tsx`
- Create: `components/magicui/border-beam.tsx`
- Create: `components/magicui/magic-card.tsx`
- Create: `components/magicui/sparkles-text.tsx`
- Create: `components/magicui/shimmer-button.tsx`

Copy each component from `magicui/magicui/apps/www/registry/magicui/` into `components/magicui/`, preserving the exact source code. Each file should have `"use client"` at top and import `cn` from `@/lib/utils`.

**Step 1: Copy BlurFade**

Copy from `magicui/magicui/apps/www/registry/magicui/blur-fade.tsx` to `components/magicui/blur-fade.tsx` — exact source, no changes needed (already uses `@/lib/utils` import pattern).

**Step 2: Copy NumberTicker**

Copy from `magicui/magicui/apps/www/registry/magicui/number-ticker.tsx` to `components/magicui/number-ticker.tsx` — exact source.

**Step 3: Copy BorderBeam**

Copy from `magicui/magicui/apps/www/registry/magicui/border-beam.tsx` to `components/magicui/border-beam.tsx` — exact source.

**Step 4: Copy MagicCard**

Copy from `magicui/magicui/apps/www/registry/magicui/magic-card.tsx` to `components/magicui/magic-card.tsx` — exact source.

**Step 5: Copy SparklesText**

Copy from `magicui/magicui/apps/www/registry/magicui/sparkles-text.tsx` to `components/magicui/sparkles-text.tsx` — exact source.

**Step 6: Copy ShimmerButton**

Copy from `magicui/magicui/apps/www/registry/magicui/shimmer-button.tsx` to `components/magicui/shimmer-button.tsx` — exact source.

**Step 7: Verify build**

Run: `pnpm build` (or `pnpm dev` and check no import errors)

**Step 8: Commit**

```bash
git add components/magicui/
git commit -m "feat: add Magic UI components (BlurFade, NumberTicker, BorderBeam, MagicCard, SparklesText, ShimmerButton)"
```

---

### Task 3: New color palette and typography — Soft & Luxe theme

**Files:**
- Modify: `app/globals.css` (full replacement of CSS variables and organic-canvas)
- Modify: `app/layout.tsx` (swap fonts to Playfair Display + DM Sans)

**Step 1: Update layout.tsx fonts**

Replace Fraunces + Spline Sans with Playfair Display (display/serif font) + DM Sans (body font). Keep the same CSS variable pattern (`--font-body`, `--font-display`).

```tsx
import { Playfair_Display, DM_Sans } from 'next/font/google';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
});
```

Update the body className to use `dmSans.variable` and `playfair.variable`.

**Step 2: Update globals.css with Soft & Luxe palette**

Replace the `:root` CSS variables with a warm rosé/champagne/sage palette:

Light mode:
- background: `oklch(0.97 0.008 60)` — warm cream
- foreground: `oklch(0.22 0.02 50)` — deep warm brown
- card: `oklch(0.98 0.006 55)` — soft ivory
- primary: `oklch(0.55 0.12 10)` — dusty rosé
- secondary: `oklch(0.72 0.06 85)` — champagne gold
- accent: `oklch(0.60 0.08 155)` — sage green
- muted: `oklch(0.94 0.008 60)` — soft linen
- muted-foreground: `oklch(0.50 0.02 55)` — warm grey
- border: `oklch(0.90 0.01 60)` — delicate cream border
- destructive: `oklch(0.58 0.18 20)` — muted coral
- Chart colors: rosé, gold, sage, lavender, peach

Dark mode:
- background: `oklch(0.16 0.02 50)` — deep chocolate
- card: `oklch(0.20 0.02 50)` — dark mocha
- primary: `oklch(0.72 0.12 10)` — light rosé
- secondary: `oklch(0.75 0.08 85)` — warm gold
- accent: `oklch(0.68 0.08 155)` — light sage
- foreground: `oklch(0.95 0.008 60)` — warm white

**Step 3: Update the organic-canvas background**

Replace green/tan gradients with rosé/champagne gradients:
- Top-left: soft rosé glow `rgba(210, 155, 140, 0.18)`
- Top-right: champagne shimmer `rgba(220, 195, 155, 0.15)`
- Base gradient: warm cream to soft ivory

Dark mode version with deep rosé/burgundy glows.

**Step 4: Add shimmer-slide and spin-around keyframes for ShimmerButton**

Add to globals.css:
```css
@keyframes shimmer-slide {
  to { transform: translateX(calc(100cqw - 100%)); }
}
@keyframes spin-around {
  0% { transform: translateZ(0) rotate(0); }
  15%, 35% { transform: translateZ(0) rotate(90deg); }
  65%, 85% { transform: translateZ(0) rotate(270deg); }
  100% { transform: translateZ(0) rotate(360deg); }
}
```

And the utility classes:
```css
.animate-shimmer-slide {
  animation: shimmer-slide var(--speed) ease-in-out infinite alternate;
}
.animate-spin-around {
  animation: spin-around calc(var(--speed) * 2) infinite linear;
}
```

**Step 5: Verify — run dev server and check the page renders with new colors/fonts**

Run: `pnpm dev`

Expected: Page loads with warm rosé/cream palette, Playfair Display headings, DM Sans body text.

**Step 6: Commit**

```bash
git add app/globals.css app/layout.tsx
git commit -m "feat: soft & luxe color palette with Playfair Display + DM Sans typography"
```

---

### Task 4: Redesign the main page layout with BlurFade animations

**Files:**
- Modify: `app/page.tsx`

**Step 1: Add BlurFade staggered entrance animations**

Import `BlurFade` from `@/components/magicui/blur-fade`. Wrap each major section in `<BlurFade>` with staggered `delay` values:

- Header section: `delay={0.1}`
- KPI Summary: `delay={0.2}`
- Pie Chart: `delay={0.3}`
- Category Toggles: `delay={0.35}`
- Expenses Table: `delay={0.25}`
- Notes Panel: `delay={0.4}`

**Step 2: Add ThemeToggle to the header**

Import `ThemeToggle` from `@/components/theme-toggle`. Place it in the header section alongside the "Vida en casa" badge.

**Step 3: Update the header badge styling**

Change the badge from plain to a rosé-tinted pill:
```tsx
<span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-primary font-medium">
```

**Step 4: Upgrade the loading skeleton state**

Add a subtle pulsing animation and rosé tint to the skeleton loading state, wrapped in BlurFade.

**Step 5: Update decorative blobs**

Change the floating blob colors from green/secondary to rosé/champagne tones:
- Right blob: `bg-primary/15` (rosé glow)
- Left blob: `bg-secondary/12` (champagne glow)

**Step 6: Verify — full page loads with staggered animations**

Run: `pnpm dev`

Expected: Each section fades in with blur effect in sequence. Header appears first, then KPI cards, then chart, etc.

**Step 7: Commit**

```bash
git add app/page.tsx
git commit -m "feat: staggered BlurFade entrance animations and header redesign"
```

---

### Task 5: Redesign KPI Summary with MagicCard + NumberTicker

**Files:**
- Modify: `components/dashboard/kpi-summary.tsx`

**Step 1: Replace Card wrappers with MagicCard**

Import `MagicCard` from `@/components/magicui/magic-card` and `NumberTicker` from `@/components/magicui/number-ticker`. Wrap each KPI in MagicCard with soft rosé gradient colors:

```tsx
<MagicCard
  gradientColor="rgba(210, 155, 140, 0.08)"
  gradientFrom="rgba(210, 155, 140, 0.4)"
  gradientTo="rgba(220, 195, 155, 0.3)"
  gradientOpacity={0.5}
  className="rounded-2xl"
>
```

**Step 2: Replace static number display with NumberTicker**

For the total expenses amount, use NumberTicker to animate the value:

Create a custom currency NumberTicker that formats as ARS. Since NumberTicker uses `Intl.NumberFormat('en-US')` internally, we need a wrapper approach: display the `$` prefix separately and use NumberTicker for the numeric value, then let it animate.

```tsx
<div className="flex items-baseline gap-1">
  <span className="text-lg text-muted-foreground font-serif">$</span>
  <NumberTicker
    value={totalExpenses}
    className="text-3xl font-semibold text-foreground font-serif tabular-nums"
  />
</div>
```

**Step 3: Add SparklesText to the top expense name**

Import `SparklesText` from `@/components/magicui/sparkles-text`. Wrap the top expense name:

```tsx
<SparklesText
  sparklesCount={6}
  colors={{ first: "oklch(0.55 0.12 10)", second: "oklch(0.72 0.06 85)" }}
  className="text-xl font-semibold text-foreground font-serif"
>
  {topExpense.name}
</SparklesText>
```

**Step 4: Update icons from Leaf/Sprout to more luxe icons**

Replace `Leaf` → `Wallet` and `Sprout` → `TrendingUp` (or `Crown` for top expense) from lucide-react. These feel more polished.

**Step 5: Verify — KPI cards have hover gradient effect and animated numbers**

Expected: Hovering over cards shows mouse-following rosé gradient. Numbers animate up on load. Top expense name has sparkle effect.

**Step 6: Commit**

```bash
git add components/dashboard/kpi-summary.tsx
git commit -m "feat: MagicCard hover effects, NumberTicker animations, SparklesText on KPI cards"
```

---

### Task 6: Redesign Expenses Pie Chart with BorderBeam

**Files:**
- Modify: `components/dashboard/expenses-pie-chart.tsx`

**Step 1: Update pie chart color palette to Soft & Luxe**

Replace the green/brown PALETTE with rosé/champagne/sage tones:
```tsx
const PALETTE = [
  'oklch(0.62 0.12 10)',   // dusty rosé
  'oklch(0.72 0.08 85)',   // champagne gold
  'oklch(0.60 0.08 155)',  // sage
  'oklch(0.65 0.10 320)',  // soft lavender
  'oklch(0.70 0.10 55)',   // warm peach
  'oklch(0.55 0.06 200)',  // dusty blue
  'oklch(0.68 0.08 130)',  // mint
  'oklch(0.60 0.12 30)',   // terracotta
]
```

**Step 2: Add BorderBeam to the chart card**

Import `BorderBeam` from `@/components/magicui/border-beam`. Add it inside the Card with rosé-to-gold gradient:

```tsx
<Card className="relative overflow-hidden border border-border/70 bg-card/90 shadow-sm backdrop-blur rounded-2xl">
  <BorderBeam
    size={120}
    duration={8}
    colorFrom="oklch(0.65 0.12 10)"
    colorTo="oklch(0.72 0.08 85)"
    borderWidth={1.5}
  />
  {/* existing card content */}
</Card>
```

**Step 3: Upgrade the center total display**

Make the center of the donut chart more luxe:
```tsx
<div className="rounded-full bg-card/90 px-5 py-3 text-center backdrop-blur-sm shadow-sm border border-border/40">
  <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-medium">Total</p>
  <p className="text-sm font-semibold text-foreground font-serif">{formatCurrency(total)}</p>
</div>
```

**Step 4: Upgrade the highlight callout**

Style the "Más alto" section with a subtle rosé background tint:
```tsx
<div className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3">
```

**Step 5: Verify and commit**

```bash
git add components/dashboard/expenses-pie-chart.tsx
git commit -m "feat: rosé/champagne pie chart palette with BorderBeam animation"
```

---

### Task 7: Redesign Category Toggles with refined styling

**Files:**
- Modify: `components/dashboard/category-toggles.tsx`

**Step 1: Add category color dots**

Add small colored dots next to each category name that match the pie chart palette, so users can visually connect toggles to chart segments:

```tsx
const PALETTE = [
  'oklch(0.62 0.12 10)',
  'oklch(0.72 0.08 85)',
  'oklch(0.60 0.08 155)',
  'oklch(0.65 0.10 320)',
  'oklch(0.70 0.10 55)',
  'oklch(0.55 0.06 200)',
  'oklch(0.68 0.08 130)',
  'oklch(0.60 0.12 30)',
]
```

Each toggle row gets a dot:
```tsx
<span
  className="inline-block h-2.5 w-2.5 rounded-full shrink-0"
  style={{ backgroundColor: PALETTE[index % PALETTE.length] }}
/>
```

**Step 2: Refine toggle row styling**

Update each toggle row for a more luxe feel:
```tsx
<div className="flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-card/60 px-4 py-2.5 backdrop-blur-sm transition-all hover:bg-card/80 hover:shadow-sm">
```

**Step 3: Verify and commit**

```bash
git add components/dashboard/category-toggles.tsx
git commit -m "feat: refined category toggles with color-coded dots"
```

---

### Task 8: Redesign Expenses Table with luxe styling

**Files:**
- Modify: `components/dashboard/expenses-table.tsx`

**Step 1: Add color dots to table rows**

Import the same PALETTE. Add colored dots in the expense name column matching the pie chart, same as toggles. This needs access to all category keys to get the right index — accept a `categoryKeys` prop or compute the index from the `categories` Record.

**Step 2: Add a subtle total footer row**

After the table body, add a footer row showing the total of visible expenses:

```tsx
<TableRow className="border-t-2 border-primary/20 bg-primary/5">
  <TableCell className="font-semibold text-foreground">Total</TableCell>
  <TableCell className="text-right font-mono text-sm font-semibold text-foreground">
    {formatCurrency(total)}
  </TableCell>
</TableRow>
```

Accept `total` as a prop from the parent.

**Step 3: Refine hover state**

```tsx
<TableRow className="hover:bg-primary/5 transition-colors">
```

**Step 4: Update parent page.tsx to pass `total` prop**

Pass `totalSelected` as a `total` prop to ExpensesTable.

**Step 5: Verify and commit**

```bash
git add components/dashboard/expenses-table.tsx app/page.tsx
git commit -m "feat: luxe expense table with color dots and total footer"
```

---

### Task 9: Redesign Notes Panel with soft styling

**Files:**
- Modify: `components/dashboard/notes-panel.tsx`

**Step 1: Upgrade notes panel styling**

Add a quote-like left border accent and italic text styling:

```tsx
<Card className="border border-border/50 bg-card/70 shadow-sm backdrop-blur rounded-2xl overflow-hidden">
  <div className="border-l-3 border-primary/40 pl-0">
    <CardHeader className="pb-2 pl-6">
      <CardTitle className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
        <NotebookPen className="h-4 w-4 text-primary" />
        Notas
      </CardTitle>
    </CardHeader>
    <CardContent className="pl-6">
      <p className="text-sm leading-relaxed text-foreground/85 italic whitespace-pre-wrap">{notes}</p>
    </CardContent>
  </div>
</Card>
```

**Step 2: Verify and commit**

```bash
git add components/dashboard/notes-panel.tsx
git commit -m "feat: refined notes panel with quote-style left border"
```

---

### Task 10: Final polish — dark mode adjustments and responsive refinements

**Files:**
- Modify: `app/globals.css` (dark mode organic-canvas)
- Review all components for dark mode consistency

**Step 1: Update dark organic-canvas**

Add dark mode variant for organic-canvas using `.dark .organic-canvas` or a `.dark &` nested rule:
```css
.dark .organic-canvas {
  background:
    radial-gradient(1200px 600px at 10% -10%, rgba(160, 100, 90, 0.12), transparent 60%),
    radial-gradient(900px 500px at 90% 10%, rgba(180, 150, 100, 0.10), transparent 55%),
    linear-gradient(180deg, oklch(0.16 0.02 50), oklch(0.14 0.02 50));
}
```

**Step 2: Update MagicCard dark mode colors**

In kpi-summary.tsx, add dark mode gradient colors:
```tsx
gradientColor="rgba(160, 100, 90, 0.06)"
```
(The existing MagicCard handles dark/light via the bg-background class internally.)

**Step 3: Test dark mode toggle**

Toggle theme and verify:
- All cards readable
- Pie chart colors visible against dark background
- BorderBeam visible
- SparklesText visible
- NumberTicker text color correct

**Step 4: Responsive check**

Verify on mobile viewport (375px) that:
- KPI cards stack vertically
- Toggles are single column on small screens
- Pie chart scales properly
- Table is readable

**Step 5: Commit**

```bash
git add app/globals.css components/dashboard/kpi-summary.tsx
git commit -m "feat: dark mode polish and responsive refinements"
```

---

### Task 11: Update Year/Month Selector with refined styling

**Files:**
- Modify: `components/dashboard/year-month-selector.tsx`

**Step 1: Refine select trigger styling**

Update the SelectTrigger styling for a more luxe feel:
```tsx
<SelectTrigger className="w-full sm:w-32 rounded-full border-border/50 bg-card/70 shadow-sm backdrop-blur-sm hover:bg-card/90 transition-all">
```

**Step 2: Verify and commit**

```bash
git add components/dashboard/year-month-selector.tsx
git commit -m "feat: refined year/month selector styling"
```

---

## Execution Notes

- **All business logic is untouched** — data fetching, calculations, toggles, filtering all remain exactly the same
- **Every task is visually verifiable** — run `pnpm dev` after each task and check in browser
- **The PALETTE array should be consistent** across pie chart, toggles, and table (extract to shared constant if needed)
- **motion/react** is the critical new dependency — everything else is already installed
