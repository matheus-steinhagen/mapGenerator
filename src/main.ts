import type { Terrain, WorldCell } from "./type";
import { perlin2D } from "./perlinNoise";

const canvas = document.getElementById('world') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
const tileSize = 16;

//Número de linhas e colinas da grid
const rows = 15;
const cols = 15;

//Tamanho dinâmico do canvas
canvas.width = rows * tileSize;
canvas.height = cols * tileSize;

//A constante world é uma matriz de WorldCell
const world:WorldCell[][] = [];

const offsetX = Math.random() * 1000;
const offsetY = Math.random() * 1000;
const frequency = 0.08; //Controla a escala do rupido (quanto menor, mais "zoom")

//Iterando em cada linha da matriz
for(let y = 0; y < rows; y++){

    //Definindo que a linha é um array de WorldCell
    const row:WorldCell[] = [];

    //Iterando em cada célula da linha (coluna)
    for(let x = 0; x < cols; x++){

        //Usamos Perlin para gerar padrões naturais
        const noise = perlin2D((x + offsetX) * frequency, (y + offsetY) * frequency) //Ruído varia de -1 a 1
        const r = (noise + 1) / 2;
        
        let terrain:Terrain = 'water'; //Padrão
        if(r > 0.42) terrain = 'mud';
        if(r > 0.48) terrain = 'grass'; //Ponto mais alto

        row.push({ terrain }); //Adiciona uma célula na linha
    }
    world.push(row); //Adiciona uma linha na matriz do mundo
}

//Acessando tileset alvo
const floorTileset = new Image();
floorTileset.src = './public/assets/Floors_Tiles.png';
const waterTileset = new Image();
waterTileset.src = './public/assets/Water_Tiles.png';

//Identificando o Tile no documento
const terrainTileData:Record<Terrain, {image: HTMLImageElement; x:number; y:number}> = {
    water: { image: waterTileset, x: 32,  y: 192 },
    grass: { image: floorTileset, x: 32,  y: 160 },
    mud:   { image: floorTileset, x: 192, y: 160 }
};

Promise.all([
    loadImage(floorTileset),
    loadImage(waterTileset)
]).then(() => {
    drawWorld();
});

function loadImage(img: HTMLImageElement): Promise<void> {
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

//Renderizando mundo
function drawBaseLayer() {
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const cell = world[y][x];
            const tile = terrainTileData[cell.terrain];
            ctx.drawImage(tile.image, tile.x, tile.y, tileSize, tileSize, x * tileSize, y * tileSize, tileSize, tileSize);
        }
    }
}

function drawWorld() {
    drawBaseLayer();
}