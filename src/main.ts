import type { Terrain } from "./type";
import { Grid } from "./Grid";
import { Render } from "./Render";

//Determinar tamanho do mapa
const rows = 35
const cols = 50;

//Determinar frequencia do ruído de Perlin
const frequency = 0.035

//Determinar tamanho dos tiles
const tileSize = 16;

//Escolher terrenos
const activeTerrains:  Terrain[] = ['water', 'grass', 'dirt'];

function generateThresholds(): { terrain: Terrain; threshold: number }[]{
  const step = 1 / activeTerrains.length;
  return activeTerrains.map((terrain, i) => ({
    terrain,
    threshold: (i + 1) * step
  }));
}

async function start() {
  const thresholds = generateThresholds();

  const grid = new Grid(cols, rows);
  grid.generate(frequency, thresholds);

  const render = new Render(grid.get(), tileSize);
  await render.loadTerrainDataFromJSON(activeTerrains);
  render.generateObjects();
  render.drawWorld();
}

start();