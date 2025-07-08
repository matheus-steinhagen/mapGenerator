//Preparando tipos
export type Terrain = 'water' | 'dirt' | 'grass'; // tipo de terreno

export type GridCell = {
    terrain:Terrain; // O tipo WorldCell possui uma propriedade do tipo Terrain
};

export type TerrainTileInfo = {image: HTMLImageElement; x:number; y:number};