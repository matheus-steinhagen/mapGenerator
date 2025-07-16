//Preparando tipos
export type Terrain = 'water' | 'dirt' | 'grass' | 'dirtWall' | 'grassElevated'; // tipo de terreno

export type GridCell = {
    terrain:Terrain; // Terreno base
    object?: string; // Objetos: tree, rock, flower
    objectOrigin?: boolean;
    occupied?:boolean;
    wall?: boolean;
};

export type TerrainData = {
  terrain: {
    tileSet: string;
    frames: number[];
  };
  transition?: {
    name: Terrain,
    tileSet: string;
    tileMap: Record<string, number>;
  };
  objects?: {
    name: string;
    tileSet: string;
    frames: number[];
    chance: number;
    distribution?: "cluster" | "spread";
    width: number;
    height: number;
  }[];
};

export type ObjectData = {
  id: string;
  displayName: string;
  tileSet: string;
  frames: number[];
  frameRate?: number;

  width: number;
  height: number;

  chance: number;
  terrains: Terrain[]; // terrenos onde pode nascer
  cluster?: boolean;

  collectible?: boolean;
  type?: "collectable" | "decoration" | "structure" | "drop" | "functional";

  walkable?: boolean;   // pode andar por cima (ex: flor, item)

  effects?: {
    water?: number;
    food?: number;
    energy?: number;
    mood?: number;
    health?: number;
  };
};