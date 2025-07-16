import type { Terrain, GridCell, TerrainData} from "./type";
import { getBitmask, getTransitionTile} from "./bitmask";
import { getWallBitmask, getWallTileName } from './getWallBitmask';


export class Render{

    private canvas:HTMLCanvasElement;
    private ctx:CanvasRenderingContext2D;
    private tileSize:number;

    private grid:GridCell[][] = [];
    private cols:number;
    private rows:number;

    private terrainDataMap: Map<Terrain, TerrainData>;
    private imageMap: Map<string,HTMLImageElement>;

    private animationFrame: number = 0;
    private animationSpeed: number = 45; // menor = mais rápido

    constructor(grid:GridCell[][],tileSize:number, terrainDataMap: Map<Terrain, TerrainData>, imageMap: Map<string,HTMLImageElement>){
        this.grid = grid;
        this.cols = grid[0].length;
        this.rows = grid.length;
        this.tileSize = tileSize;

        this.terrainDataMap = terrainDataMap;
        this.imageMap = imageMap;

        const canvas = document.getElementById('world') as HTMLCanvasElement;
        if (!canvas) throw new Error(`Canvas não encontrado.`);

        const ctx = canvas.getContext('2d')!;
        if (!ctx) throw new Error(`Não foi possível obter o contexto 2D do canvas`);

        this.canvas = canvas;
        this.ctx = ctx;
        this.canvas.width = this.cols * this.tileSize;
        this.canvas.height = this.rows * this.tileSize;
    }

    private drawTerrain(): void {
        for(let y = 0; y < this.rows; y++){
            for(let x = 0; x < this.cols; x++){
                const cell = this.grid[y][x];

                const data = this.terrainDataMap.get(cell.terrain);
                if(!data) continue;

                const frameIndex = this.getAnimatedFrame(data.terrain.frames);
                const img = this.imageMap.get(data.terrain.tileSet);
                if(!img) continue;

                const tilesPerRow = img.width / this.tileSize;
                const sx = (frameIndex % tilesPerRow) * this.tileSize;
                const sy = Math.floor(frameIndex / tilesPerRow) * this.tileSize;

                this.ctx.drawImage(
                    img,
                    sx, sy, this.tileSize, this.tileSize,
                    x * this.tileSize, y * this.tileSize,
                    this.tileSize, this.tileSize  
                );
                //x.ctx.drawImage(img, a, b, x, y)
            }
        }
    }

    private drawTransitions(): void {
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {

                const cell = this.grid[y][x];
                if(cell.terrain == "dirtWall") continue;

                const data = this.terrainDataMap.get(cell.terrain);
                if (!data) continue;

                const transition = data.transition;
                if (!transition) continue;

                const bitmask = getBitmask(x, y, cell.terrain, transition.name, this.grid);
                if (bitmask === 0) continue;

                const tileName = getTransitionTile(bitmask);
                if (!tileName) continue;

                const frame = transition.tileMap[tileName];
                const img = this.imageMap.get(transition.tileSet);
                if (!img) continue;

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

    private drawObjects(): void {
        for(let y = 0; y < this.rows; y++){
            for(let x = 0; x < this.cols; x++){
                const cell = this.grid[y][x];

                // Só desenha se for a origem do objeto
                if (!cell.object || cell.occupied) continue;

                const data = this.terrainDataMap.get(cell.terrain);
                if (!data || !data.objects) continue;

                if(!cell.object) continue;
                
                const obj = data.objects.find(o => o.name === cell.object)
                if(!obj) continue;

                const frameIndex = this.getAnimatedFrame(obj.frames);
                const img = this.imageMap.get(obj.tileSet);
                if(!img) continue;

                const tilesPerRow = img.width / this.tileSize;
                const sx = (frameIndex % tilesPerRow) * this.tileSize;
                const sy = Math.floor(frameIndex / tilesPerRow) * this.tileSize;

                // Dimensões do objeto
                const drawX = x - Math.floor(obj.width! / 2);
                const drawY = y - obj.height! + 1;

                this.ctx.drawImage(
                    img,
                    sx, sy,
                    obj.width! * this.tileSize, obj.height! * this.tileSize,
                    drawX * this.tileSize, drawY * this.tileSize,
                    obj.width! * this.tileSize, obj.height! * this.tileSize
                );
            }
        }
    }

    public processWalls(height: number): void {
        for (let x = 0; x < this.cols; x++) {
            let y = this.rows - 1;

            while (y >= 0) {
                // Procurar uma sequência contínua de dirtWall de baixo para cima
                let startY = y;
                let count = 0;

                while (y >= 0 && this.grid[y][x].terrain === 'dirtWall') {
                    count++;
                    y--;
                }

                if (count > 0) {
                    if (count >= height + 2) {

                        // Marca os últimos `height` tiles da sequência como wall = true
                        for (let i = 0; i < count; i++) {
                            const cy = startY - i;
                            if (i < height) this.grid[cy][x].wall = true;
                            //else  this.grid[cy][x].terrain = "dirt";
                        }
                    } else {
                        // Corrige todos para dirt se a sequência for menor que height
                        for (let i = 0; i < count; i++) {
                            const cy = startY - i;
                            this.grid[cy][x].terrain = 'dirt';
                        }
                    }
                }

                y--; // continua varrendo acima da sequência
            }
        }
    }

    private drawWalls(): void {
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {

                const cell = this.grid[y][x];
                if (cell.terrain !== 'dirtWall') continue;

                const data = this.terrainDataMap.get(cell.terrain);
                if (!data) continue;

                const transition = data.transition;
                if (!transition) continue;

                const bitmask = getWallBitmask(x, y, this.grid, cell.wall!);
                const tileName = getWallTileName(bitmask, cell.wall!);

                const frame = transition.tileMap[tileName];

                const img = this.imageMap.get(data.terrain.tileSet);
                if (!img) continue;

                const tilesPerRow = Math.floor(img.width / this.tileSize);
                const sx = (frame % tilesPerRow) * this.tileSize;
                const sy = Math.floor(frame / tilesPerRow) * this.tileSize;

                this.ctx.drawImage(
                    img,
                    sx, sy, this.tileSize, this.tileSize,
                    x * this.tileSize, y * this.tileSize,
                    this.tileSize, this.tileSize
                );

                //cell.terrain = 'dirt';
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
        this.drawWalls();
        this.drawObjects();
        //this.drawLayer("entity");
        this.animationFrame++;
        requestAnimationFrame(() => this.drawWorld())
    }
}