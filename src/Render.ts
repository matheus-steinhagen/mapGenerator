import type { Terrain, GridCell, TerrainData } from "./type";
import { getBitmask, getTransitionTile} from "./bitmask";
import { fbm2D } from "./fractalBrownianMotion";


export class Render{

    private canvas:HTMLCanvasElement;
    private ctx:CanvasRenderingContext2D;
    private tileSize:number;

    private grid:GridCell[][] = [];
    private cols:number;
    private rows:number;

    private terrainDataMap: Partial<Record<Terrain, TerrainData>> = {};
    private loadedImages: Record<string,HTMLImageElement> = {};

    private animationFrame: number = 0;
    private animationSpeed: number = 45; // menor = mais rápido

    constructor(grid:GridCell[][],tileSize:number){
        this.grid = grid;
        this.cols = grid[0].length;
        this.rows = grid.length;
        this.tileSize = tileSize;

        const canvas = document.getElementById('world') as HTMLCanvasElement;
        if (!canvas) throw new Error(`Canvas não encontrado.`);

        const ctx = canvas.getContext('2d')!;
        if (!ctx) throw new Error(`Não foi possível obter o contexto 2D do canvas`);

        this.canvas = canvas;
        this.ctx = ctx;
        this.canvas.width = this.cols * this.tileSize;
        this.canvas.height = this.rows * this.tileSize;
    }

    public async loadTerrainDataFromJSON(terrainList: Terrain[]){
        for(const terrain of terrainList){
            const response = await fetch(`/data/terrains/${terrain}.json`);
            const data: TerrainData = await response.json();
            this.terrainDataMap[terrain] = data;

            //Carregar tilesets necessários
            const imagesToLoad: Set<string> = new Set();
            imagesToLoad.add(data.terrain.tileSet);

            if(data.transitions){
                for(const key in data.transitions){
                    imagesToLoad.add(data.transitions[key as Terrain].tileSet);
                }
            }
            if(data.objects){
                for(const key in data.objects){
                    imagesToLoad.add(data.objects[key].tileSet)
                }
            }

            //Carregar imagens
            for(const src of imagesToLoad){
                if(!this.loadedImages[src]){
                    const img = new Image();
                    img.src = `/assets/${src}`;
                    await img.decode();
                    this.loadedImages[src] = img
                }
            }
        }
    }

    public generateObjects(): void {
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                const cell = this.grid[y][x];
                if (cell.object) continue; // já possui objeto

                const data = this.terrainDataMap[cell.terrain];
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

                const data = this.terrainDataMap[cell.terrain];
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

    public terrainCorrections(){
        for (let y = 1; y < this.rows - 1; y++) {
            for (let x = 1; x < this.cols - 1; x++) {
                const cell = this.grid[y][x];

                // Vizinhaça 8-direcional
                const neighbors = [
                this.grid[y - 1][x],     // cima
                //this.grid[y - 1][x + 1], // cima direita
                this.grid[y][x + 1],     // direita
                //this.grid[y + 1][x + 1], // baixo direita
                this.grid[y + 1][x],     // baixo
                //this.grid[y + 1][x - 1], // baixo esquerda
                this.grid[y][x - 1],     // esquerda
                //this.grid[y - 1][x - 1]  // cima esquerda
                ];

                let sameCount = 0;
                const terrainCount: Record<Terrain, number> = {} as any;

                for (const neighbor of neighbors) {
                    // Conta número de vizinhos iguais
                    if (neighbor.terrain === cell.terrain) sameCount++;

                    // Contagem de cada tipo de terreno
                    const t = neighbor.terrain;
                    terrainCount[t] = (terrainCount[t] ?? 0) + 1;
                }

                // Se a célula estiver isolada ou quase isolada
                if (sameCount <= 1) {
                    const predominant = Object.entries(terrainCount)
                    .sort((a, b) => b[1] - a[1])[0][0] as Terrain;

                    cell.terrain = predominant;

                    if(predominant == 'grass') cell.transition = 'water'
                    else if(predominant == 'dirt') cell.transition = 'grass'
                }
            }
        }
    }

    private drawTerrain(){
        for(let y = 0; y < this.rows; y++){
            for(let x = 0; x < this.cols; x++){
                const cell = this.grid[y][x];

                const data = this.terrainDataMap[cell.terrain];
                if(!data) continue;

                const frameIndex = this.getAnimatedFrame(data.terrain.frames);
                const img = this.loadedImages[data.terrain.tileSet];

                const tilesPerRow = img.width / this.tileSize;
                const sx = (frameIndex % tilesPerRow) * this.tileSize;
                const sy = Math.floor(frameIndex / tilesPerRow) * this.tileSize;

                this.ctx.drawImage(
                    img,
                    sx, sy, this.tileSize, this.tileSize,
                    x * this.tileSize, y * this.tileSize,
                    this.tileSize, this.tileSize  
                );
            }
        }
    }

    private drawTransitions(){
        for(let y = 0; y < this.rows; y++){
            for(let x = 0; x < this.cols; x++){
                const cell = this.grid[y][x];

                const data = this.terrainDataMap[cell.terrain];
                if(!data) continue;

                const transition = data.transitions?.[cell.transition as Terrain];
                if (!transition) continue;

                const bitmask = getBitmask(x, y, cell.terrain, cell.transition!, this.grid);
                if(bitmask == 0) continue;

                const tileName = getTransitionTile(bitmask);
                if (!tileName || !transition.tileMap[tileName]) continue;

                const frame = transition.tileMap[tileName];

                const img = this.loadedImages[transition.tileSet];

                const tilesPerRow = img.width / this.tileSize;
                const sx = (frame % tilesPerRow) * this.tileSize;
                const sy = Math.floor(frame / tilesPerRow) * this.tileSize;

                this.ctx.drawImage(
                    img,
                    sx, sy, this.tileSize, this.tileSize,
                    x * this.tileSize, y * this.tileSize,
                    this.tileSize, this.tileSize  
                );
            }
        }
    }

    private drawObjects(){
        for(let y = 0; y < this.rows; y++){
            for(let x = 0; x < this.cols; x++){
                const cell = this.grid[y][x];

                const data = this.terrainDataMap[cell.terrain];
                if (!data || !data.objects) continue;

                if(!cell.object) continue;
                
                const obj = data.objects.find(o => o.name === cell.object)
                if(!obj) continue;

                const frameIndex = this.getAnimatedFrame(obj.frames);
                const img = this.loadedImages[obj.tileSet];

                const tilesPerRow = img.width / this.tileSize;
                const sx = (frameIndex % tilesPerRow) * this.tileSize;
                const sy = Math.floor(frameIndex / tilesPerRow) * this.tileSize;

                this.ctx.drawImage(
                    img,
                    sx, sy, this.tileSize, this.tileSize,
                    x * this.tileSize, y * this.tileSize,
                    this.tileSize, this.tileSize  
                );
            }
        }
    }

    private getAnimatedFrame(frames: number[]): number {
        if (frames.length <= 1) return frames[0];
        const index = Math.floor(this.animationFrame / this.animationSpeed) % frames.length;
        return frames[index];
    }

    public drawWorld(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawTerrain();
        this.drawTransitions();
        this.drawObjects();
        //this.drawLayer("entity");
        this.animationFrame++;
        requestAnimationFrame(() => this.drawWorld())
    }
}