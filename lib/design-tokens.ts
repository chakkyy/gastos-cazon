/**
 * Design tokens derived from design-system.json.
 * Single source of truth for all color values used in JS/TSX.
 *
 * For CSS usage, prefer the CSS custom properties defined in globals.css
 * (e.g. var(--ds-plant), var(--primary), etc.)
 */

export const colors = {
  deepJungle:      '#3F4441',
  deepJungleLight: '#575E5A',
  deepJungleDark:  '#262927',
  plant:           '#A7C280',
  plantLight:      '#BED2A2',
  plantDark:       '#8FB15D',
  olive:           '#5F7240',
  oliveLight:      '#7A9252',
  oliveDark:       '#43512D',
  beige:           '#F7E5D7',
  beigeLight:      '#FEFFFF',
  beigeDark:       '#EEC9AC',
  accentPink:      '#EFCED5',
  error:           '#CC9275',
} as const

export type ColorToken = keyof typeof colors
