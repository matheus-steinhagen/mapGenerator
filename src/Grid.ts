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
                    0.1,    // persistence
                    7.0     // lacunarity
                );
                const r = (noise + 1) / 2
                
                let terrain:Terrain = terrains[0].terrain;
                let transition:Terrain = 'water';

                for(let i = 0; i < terrains.length; i++){
                    const current = terrains[i];
                    if(r <= current.threshold){
                        terrain = current.terrain;
                        if(terrain == 'dirt') transition = 'grass'; //ARMENGUE!!!
                        break;
                    }
                }

                row.push({ terrain, transition }); //Adiciona uma célula na linha
            }
            this.grid.push(row); //Adiciona uma linha na matriz do mundo
        }
    }
}