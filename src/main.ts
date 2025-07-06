const canvas = document.getElementById('world') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
const tileSize = 16;

//Preparando tipos
type Terrain = 'grass' | 'water' | 'mud'; // tipo de terreno

type WorldCell = {
    terrain:Terrain; // O tipo WorldCell possui uma propriedade do tipo Terrain
}

//Número de linhas e colinas da grid
const rows = 15;
const cols = 15;

//Tamanho dinâmico do canvas
canvas.width = rows * tileSize;
canvas.height = cols * tileSize;

//A constante world é uma matriz de WorldCell
const world:WorldCell[][] = [];

//Iterando em cada linha da matriz
for(let y = 0; y < rows; y++){

    //Definando que a linha é um array de WorldCell
    const row:WorldCell[] = [];

    //Iterando em cada célula da linha (coluna)
    for(let x = 0; x < cols; x++){

        //Cada tipo tem 1/3 de chance de aparecer
        const r = Math.random(); //Atribui a r um valor aleatório entre 0 e 1
        let terrain:Terrain = 'water';
        if(r < 0.50) terrain = 'grass';
        else if(r < 0.70) terrain = 'mud';

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
function drawWorld(){
    console.log('Estou sendo chamado');
    for(let y = 0; y < rows; y++){
        for(let x = 0; x < cols; x++){
            const cell = world[y][x];
            const tile = terrainTileData[cell.terrain];
            const { x: sx, y: sy } = tile;

            ctx.drawImage(
                tile.image,
                sx, sy,
                tileSize, tileSize,
                x * tileSize, y * tileSize,
                tileSize, tileSize
            )
        }
    }
}