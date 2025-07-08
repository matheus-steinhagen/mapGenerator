import type { Terrain, GridCell, TerrainTileInfo } from "./type";
import { getBitmask, getTransitionTile, grassTiles, dirtTiles } from "./bitmask";


export class Render{

    private canvas:HTMLCanvasElement;
    private ctx:CanvasRenderingContext2D;
    private tileSize:number;

    private grid:GridCell[][] = [];
    private cols:number;
    private rows:number;


    private terrainTileData:Record<Terrain, TerrainTileInfo>
    private transitions:Partial<Record<Terrain,{
        to:Terrain;
        tileset: HTMLImageElement;
        tileMap:Record<string,number>;
    }>>;

    //Acessando tileset alvo
    private floortileset:HTMLImageElement = new Image();
    private watertileset:HTMLImageElement = new Image();

    constructor(grid:GridCell[][],tileSize:number){
        this.grid = grid;
        this.cols = grid[0].length;
        this.rows = grid.length;

        const canvas = document.getElementById('world') as HTMLCanvasElement;
        if (!canvas) throw new Error(`Canvas não encontrado.`);

        const ctx = canvas.getContext('2d')!;
        if (!ctx) throw new Error(`Não foi possível obter o contexto 2D do canvas`);

        this.canvas = canvas;
        this.ctx = ctx;
        this.tileSize = tileSize;
        this.canvas.width = this.cols * this.tileSize;
        this.canvas.height = this.rows * this.tileSize;

        this.floortileset.src = './public/assets/Floors_Tiles.png';
        this.watertileset.src = './public/assets/Water_Tiles.png';

        //Identificando o Tile no documento
        this.terrainTileData = {
            water: { image: this.watertileset, x: 32,  y: 192 },
            grass: { image: this.floortileset, x: 32,  y: 160 },
            dirt:   { image: this.floortileset, x: 192, y: 160 }
        };

        this.transitions = {
            grass: {
                to: 'water',
                tileset: this.watertileset,
                tileMap: grassTiles,

            },
            dirt: {
                to: 'grass',
                tileset: this.floortileset,
                tileMap: dirtTiles,

            }
        }
    }

    //Renderizando mundo
    private drawBaseLayer(): void {
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                const cell = this.grid[y][x];

                const tile = this.terrainTileData[cell.terrain];
                if(!tile) continue;

                this.ctx.drawImage(
                    tile.image,
                    tile.x, tile.y, this.tileSize, this.tileSize,
                    x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize
                );
            }
        }
    }

    //Renderizando mundo
    private drawTransitionLayer(): void {
        for (let y = 0; y < this.rows; y++) {

            for (let x = 0; x < this.cols; x++) {

                const cell = this.grid[y][x];

                const transition = this.transitions[cell.terrain];
                if(!transition) continue;

                const bitmask = getBitmask(x, y, cell.terrain, transition.to, this.grid)
                const tileName = getTransitionTile(bitmask);
                const tileIndex = transition.tileMap[tileName] ?? transition.tileMap["full"];

                const tilesPerRow: number = transition.tileset.width / this.tileSize;
                const sx: number = (tileIndex % tilesPerRow) * this.tileSize;
                const sy: number = Math.floor(tileIndex / tilesPerRow) * this.tileSize;

                this.ctx.drawImage(
                    transition.tileset,
                    sx, sy, this.tileSize, this.tileSize,
                    x * this.tileSize, y * this.tileSize,
                    this.tileSize, this.tileSize
                );
            }
        }
    }

    private loadImage(img: HTMLImageElement): Promise<void> {
        return new Promise((resolve) => {
            img.onload = () => {
                console.log('Imagem carregada:', img.src);
                resolve();
            };
            img.onerror = () => {
                console.error('Erro ao carregar imagem:', img.src);
            };
        });
    }

    public async loadTileSets(){
        await Promise.all([
            this.loadImage(this.floortileset),
            this.loadImage(this.watertileset)
        ]);
    }

    public drawWorld(){
        this.drawBaseLayer();
        this.drawTransitionLayer();
    }
}