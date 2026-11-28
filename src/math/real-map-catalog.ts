import towns from './media/spatial/swiss/towns.json'
import historicSion from './media/spatial/swiss/sion-historique-reperes.json'
import capitalPlans from './media/spatial/world/plans.json'
import imaginaryPlans from './media/spatial/imaginary/plans.json'

export type MapPoint = { name: string; x: number; y: number; country?: string }
export type GridPoint = MapPoint & { column: number; row: number; code: string }
export type RealMapGrid = { columns: number; rows: number }
export const realMapFamilies = [
  { id: 'swiss', label: 'Suisse · villes et villages' },
  { id: 'europe', label: 'Europe · capitales' },
  { id: 'world', label: 'Monde · capitales' },
  { id: 'imaginary', label: 'Plans imaginaires' },
] as const
export type RealMapFamily = (typeof realMapFamilies)[number]['id']

export type RealMapPlan = {
  id: string
  label: string
  family: RealMapFamily
  grid: RealMapGrid
  places: GridPoint[]
}

export const SION_GRID = { columns: 8, rows: 5 }
export const DEFAULT_REAL_MAP_ID = 'sion-historique'
export const REAL_MAP_COLUMNS = 'ABCDEFGHIJKL'
export const REAL_MAP_GRID_LIMITS = { minColumns: 4, maxColumns: 12, minRows: 3, maxRows: 9 }

export function realMapGrid(columns?: number, rows?: number): RealMapGrid {
  const { minColumns, maxColumns, minRows, maxRows } = REAL_MAP_GRID_LIMITS
  const clamp = (value: number | undefined, min: number, max: number, fallback: number) =>
    typeof value === 'number' && Number.isFinite(value) ? Math.min(max, Math.max(min, Math.round(value))) : fallback
  return { columns: clamp(columns, minColumns, maxColumns, SION_GRID.columns), rows: clamp(rows, minRows, maxRows, SION_GRID.rows) }
}

export function mapBackgroundLabels(family: RealMapFamily) {
  if (family === 'imaginary') return { photo: 'Vue aérienne dessinée', annotated: 'Dessin avec routes et chemins', simplified: 'Plan simplifié en noir et blanc' }
  if (family === 'europe' || family === 'world') return { photo: 'Image satellite', annotated: 'Image satellite avec les frontières', simplified: 'Carte simplifiée en noir et blanc' }
  return { photo: 'Photo aérienne réelle', annotated: 'Photo avec routes et chemins', simplified: 'Plan simplifié en noir et blanc' }
}

function withGrid(place: MapPoint, { columns, rows }: RealMapGrid): GridPoint {
  const { x, y } = place
  const column = Math.max(0, Math.min(columns - 1, Math.floor(x * columns)))
  const row = Math.max(0, Math.min(rows - 1, Math.floor(y * rows)))
  return { ...place, column, row, code: `${REAL_MAP_COLUMNS[column]}${row + 1}` }
}

export const SION_PLACES = historicSion.map(place => withGrid(place, SION_GRID))

const sion: RealMapPlan = {
  id: DEFAULT_REAL_MAP_ID,
  label: 'Sion · centre historique',
  family: 'swiss',
  grid: SION_GRID,
  places: SION_PLACES,
}

function cataloguePlans(entries: Array<{ id: string; label: string; places: MapPoint[] }>, family: RealMapFamily): RealMapPlan[] {
  return entries.map(({ id, label, places }) => ({ id, label, family, grid: SION_GRID, places: places.map(place => withGrid(place, SION_GRID)) }))
}

export const realMapPlans: RealMapPlan[] = [
  sion,
  ...cataloguePlans(towns, 'swiss'),
  ...cataloguePlans(capitalPlans.filter(plan => plan.family === 'europe'), 'europe'),
  ...cataloguePlans(capitalPlans.filter(plan => plan.family === 'world'), 'world'),
  ...cataloguePlans(imaginaryPlans, 'imaginary'),
]

export function realMapPlan(id?: string, grid = SION_GRID): RealMapPlan {
  const plan = realMapPlans.find((plan) => plan.id === id) ?? sion
  if (grid.columns === plan.grid.columns && grid.rows === plan.grid.rows) return plan
  return { ...plan, grid, places: plan.places.map(place => withGrid(place, grid)) }
}
