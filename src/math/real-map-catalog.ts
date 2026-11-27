import towns from './media/spatial/swiss/towns.json'

type MapPoint = { name: string; x: number; y: number }
type GridPoint = MapPoint & { column: number; row: number; code: string }

export type RealMapPlan = {
  id: string
  label: string
  grid: { columns: number; rows: number }
  places: GridPoint[]
}

export const SION_GRID = { columns: 4, rows: 3 }
export const DEFAULT_REAL_MAP_ID = 'sion-historique'
export const REAL_MAP_COLUMNS = 'ABCDEFG'

const sionLandmarks = [
  { name: 'Église Saint-Théodule', easting: 2593858, northing: 1120236 },
  { name: 'Hôtel de ville', easting: 2593980, northing: 1120260 },
  { name: 'Basilique de Valère', easting: 2594266, northing: 1120249 },
  { name: 'Château de Tourbillon', easting: 2594469, northing: 1120560 },
] as const

function withGrid({ name, x, y }: MapPoint, columns: number): GridPoint {
  const column = Math.floor(x * columns)
  const row = Math.floor(y * SION_GRID.rows)
  return { name, x, y, column, row, code: `${REAL_MAP_COLUMNS[column]}${row + 1}` }
}

export const SION_PLACES = sionLandmarks.map(({ name, easting, northing }) => withGrid({
  name, x: (easting - 2593720) / 940, y: (1120697 - northing) / 627,
}, SION_GRID.columns))

const sion: RealMapPlan = {
  id: DEFAULT_REAL_MAP_ID,
  label: 'Sion · centre historique',
  grid: SION_GRID,
  places: SION_PLACES,
}

const downloadedTowns: Array<{ id: string; label: string; columns?: number; places: MapPoint[] }> = towns

export const realMapPlans: RealMapPlan[] = [
  sion,
  ...downloadedTowns.map(({ id, label, columns = 4, places }) => ({
    id, label, grid: { columns, rows: SION_GRID.rows }, places: places.map((place) => withGrid(place, columns)),
  })),
]

export function realMapPlan(id?: string): RealMapPlan {
  return realMapPlans.find((plan) => plan.id === id) ?? sion
}
