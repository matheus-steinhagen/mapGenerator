import type { Terrain, GridCell, TerrainData } from "./type";
import { getBitmask, getTransitionTile} from "./bitmask";


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

                for (const obj of data.objects) {
                    if (Math.random() < obj.chance) {
                        cell.object = obj.name;
                        break; // só 1 objeto por célula
                    }
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