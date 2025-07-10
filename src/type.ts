//Preparando tipos
export type Terrain = 'water' | 'dirt' | 'grass'; // tipo de terreno

export type GridCell = {
    terrain:Terrain; // Terreno base
    transition?: Terrain; // Tile de transição
    object?: string; // Objetos: tree, rock, flower
    entity?: string; // Player, NPC, wolf...
};

export type TerrainData = {
  terrain: {
    tileSet: string;
    frames: number[];
  };
  transitions?: Record<Terrain, {
    tileSet: string;
    tileMap: Record<string, number>;
  }>;
  objects?: {
    name: string;
    tileSet: string;
    frames: number[];
    chance: number;
  }[];
};