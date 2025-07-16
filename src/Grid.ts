import type { Terrain, GridCell} from "./type";
import { fbm2D } from "./fractalBrownianMotion";

export class Grid{

    private grid:GridCell[][] = []; //A constante grid é uma matriz de GridCell
    private cols:number;
    private rows:number;

    constructor(cols:number, rows:number){
        this.cols = cols;
        this.rows = rows;
    }

    public get(){
        return this.grid;
    }

    public generate(freq:number, terrains: {terrain: Terrain; threshold: number}[]){
        const offsetX = Math.random() * 1000;
        const offsetY = Math.random() * 1000;
        const frequency = freq //0.035; //Controla a escala do ruído (quanto menor, mais "zoom")

        //Iterando em cada linha da matriz
        for(let y = 0; y < this.rows; y++){

            //Definindo que a linha é um array de GridCell
            const row:GridCell[] = [];

            //Iterando em cada célula da linha (coluna)
            for(let x = 0; x < this.cols; x++){

                //Usamos Perlin para gerar padrões naturais
                const noise = fbm2D(
                    (x + offsetX) * frequency,
                    (y + offsetY) * frequency,
                    6,      // octaves
                    0.2,    // persistence
                    2.0     // lacunarity
                );
                const r = (noise + 1) / 2
                
                let terrain:Terrain = terrains[0].terrain;

                for(let i = 0; i < terrains.length; i++){
                    const current = terrains[i];
                    if(r <= current.threshold){
                        terrain = current.terrain;
                        break;
                    }
                }

                row.push({ terrain }); //Adiciona uma célula na linha
            }
            this.grid.push(row); //Adiciona uma linha na matriz do mundo
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
                }
            }
        }
    }
}