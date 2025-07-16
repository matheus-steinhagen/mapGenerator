import type { Terrain, GridCell, TerrainData} from "./type";
import { fbm2D } from "./fractalBrownianMotion";


export class Object{

    private grid:GridCell[][] = [];
    private cols:number;
    private rows:number;

    private terrainDataMap: Map<Terrain, TerrainData>;

    constructor(grid:GridCell[][], terrainDataMap: Map<Terrain, TerrainData>){
        this.grid = grid;
        this.cols = grid[0].length;
        this.rows = grid.length;

        this.terrainDataMap = terrainDataMap;
    }

    public generateObjects(): void {
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {

                const cell = this.grid[y][x];
                if (cell.object) continue; // já possui objeto

                const data = this.terrainDataMap.get(cell.terrain);
                if (!data || !data.objects) continue;

                const spreadObjects = data.objects.filter(o => o.distribution === "spread");
                for (const obj of spreadObjects) {
                    if (Math.random() < obj.chance) {
                        cell.object = obj.name;
                        break; // só 1 objeto por célula
                    }
                }
            }
        }
    }

    public generateObjectClusters(densityThreshold = 0.7):void {
        const scale = 0.1; //Tanho dos aglomerados
        const offsetX = Math.random() * 1000;
        const offsetY = Math.random() * 1000;

        for(let y = 0; y < this.rows; y++){
            for(let x = 0; x < this.cols; x++){

                const cell = this.grid[y][x];
                if(cell.object) continue;

                const data = this.terrainDataMap.get(cell.terrain);
                if(!data || !data.objects) continue;

                const noiseValue = fbm2D(
                    (x + offsetX) * scale,
                    (y + offsetY) * scale,
                    6,      // octaves
                    0.1,    // persistence
                    7.0     // lacunarity
                );
                const normalized = (noiseValue + 1) / 2;

                if(normalized < densityThreshold) continue;

                const clusterObjects = data.objects.filter(o => o.distribution === "cluster");
                for(const obj of clusterObjects){
                    if(Math.random() < obj.chance){
                        cell.object = obj.name;
                        break
                    }
                }
            }
        }
    }

    public generateLargeObjects(): void{
        for(let y = 0; y < this.rows; y++){
            for(let x = 0; x < this.cols; x++){
                
                const cell = this.grid[y][x];
                if(cell.object || cell.occupied) continue;

                const data = this.terrainDataMap.get(cell.terrain);
                if(!data || data.objects) continue;

                const largeObjects = data.objects.filter(o => o.width && o.height);

                for(const obj of largeObjects){
                    if(Math.random() >= obj.chance) continue;

                    const w = obj.width;
                    const h = obj.height;

                    //Verifica se cabe na grid
                    if(x + w > this.cols || y + h > this.rows) continue;

                    const originX = x - Math.floor(w / 2);
                    const originY = y - h + 1;

                    let canPlace = true;
                    for(let dy = 0; dy < h; dy++){
                        for(let dx = 0; dx < w; dx++){
                            const target = this.grid[originY + dy][originX + dx];
                            if(target.object || target.occupied || target.terrain !== cell.terrain){
                                canPlace = false;
                                break;
                            }
                        }
                    }

                    if(!canPlace) continue;

                    this.grid[originY + h - 1][originX + Math.floor(w / 2)].object = obj.name;
                    this.grid[originY + h - 1][originX + Math.floor(w / 2)].objectOrigin = true;

                    // Marca as demais como ocupadas
                    for (let dy = 0; dy < h; dy++) {
                        for (let dx = 0; dx < w; dx++) {
                            if (dx === 0 && dy === 0) continue;
                            const target = this.grid[y + dy][x + dx];
                            target.occupied = true;
                        }
                    }

                    break; // só tenta um por célula
                }

            }
        }
    }
}