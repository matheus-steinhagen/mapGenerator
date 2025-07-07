//Preparando tipos
export type Terrain = 'grass' | 'water' | 'mud'; // tipo de terreno

export type WorldCell = {
    terrain:Terrain; // O tipo WorldCell possui uma propriedade do tipo Terrain
}