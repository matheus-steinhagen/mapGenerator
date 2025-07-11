import type { Terrain } from "./type";
import { Grid } from "./Grid";
import { Render } from "./Render";

//Determinar tamanho do mapa
const rows = 44
const cols = 78;

//Determinar frequencia do ruído de Perlin
const frequency = 0.05

//Determinar tamanho dos tiles
const tileSize = 16;

//Escolher terrenos
const terrainList:  Terrain[] = ['water', 'grass', 'dirt'];
const thresholdList: number[] = [0.38, 0.6, 1];

function generateThresholds(): { terrain: Terrain; threshold: number }[]{
  return terrainList.map((terrain, i) => ({
    terrain,
    threshold: thresholdList[i]
  }));
}

async function start() {
  const thresholds = generateThresholds();

  const grid = new Grid(cols, rows);
  grid.generate(frequency, thresholds);

  const render = new Render(grid.get(), tileSize);
  await render.loadTerrainDataFromJSON(terrainList);
  render.terrainCorrections();
  render.terrainCorrections();
  render.generateObjectClusters(0.75);
  render.generateObjects(); 
  render.drawWorld();
}

start();