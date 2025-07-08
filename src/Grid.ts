import type { Terrain, GridCell} from "./type";
import { perlin2D } from "./perlinNoise";

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

    public generate(freq:number){
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
                const noise = perlin2D((x + offsetX) * frequency, (y + offsetY) * frequency) //Ruído varia de -1 a 1
                const r = (noise + 1) / 2;
                
                let terrain:Terrain = 'water'; //Padrão
                if(r > 0.4) terrain = 'grass'; //Ponto mais alto
                if(r > 0.6) terrain = 'dirt';

                row.push({ terrain }); //Adiciona uma célula na linha
            }
            this.grid.push(row); //Adiciona uma linha na matriz do mundo
        }
    }
}