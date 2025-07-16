import type { Terrain, TerrainData } from "./type";
import { Grid } from "./Grid";
import { Render } from "./Render";
import { Object } from "./Object";
import { loadAssetsFromJSON } from "./loadAssetsFromJson";

//Determinar tamanho do mapa
const rows = 44
const cols = 78;

//Determinar frequencia do ruído de Perlin
const frequency = 0.04

//Determinar tamanho dos tiles
const tileSize = 16;

//Escolher terrenos
const terrainList:  Terrain[] = ['water', 'grass', 'dirt', 'dirtWall'];
const thresholdList: number[] = [0.38, 0.55, 0.6, 1];

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
  grid.terrainCorrections();
  //grid.terrainCorrections();

  const {
    terrainDataMap,
    imageMap,
  }: {
    terrainDataMap: Map<Terrain, TerrainData>,
    imageMap: Map<string, HTMLImageElement>
  } = await loadAssetsFromJSON(terrainList);

  const object = new Object(grid.get(), terrainDataMap);
  object.generateObjects();
  object.generateObjectClusters(0.75);
  object.generateLargeObjects();

  //Carregando dados
  const render = new Render(grid.get(), tileSize, terrainDataMap, imageMap);
  render.processWalls(5);
  render.drawWorld();
}

start();