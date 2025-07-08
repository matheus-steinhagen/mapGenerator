import type { Terrain, WorldCell } from "./type";
/**
 * Gera bitmask de vizinhança 8-direcional para transições de tile
 *
 * Bits:
 * 128  |  1  |  2
 * -----|-----|-----
 * 64   | x   | 4
 * -----|-----|-----
 * 32   | 16  | 8
 */
const directions = [
  { dx: 0, dy: -1, bit: 1 }, //Cima
  { dx: 1, dy: -1, bit: 2 }, //Cima direita
  { dx: 1, dy: 0, bit: 4 }, //Direita
  { dx: 1, dy: 1, bit: 8 }, //Baixo direita
  { dx: 0, dy: 1, bit: 16 }, //Baixo
  { dx: -1, dy: 1, bit: 32 }, //Baixo esquerda
  { dx: -1, dy: 0, bit: 64 }, //Esquerda
  { dx: -1, dy: -1, bit: 128 }, //Cima esquerda
];

export function getBitmask(
  x: number,
  y: number,
  terrain: Terrain,
  transition: Terrain,
  world: WorldCell[][]
): number {
  const rows = world.length;
  const cols = world[0].length;
  let mask = 0;

  //Iterando sobre cada direção
  for (const { dx, dy, bit } of directions) {
    //nova posição
    const nx = x + dx;
    const ny = y + dy;

    //Se a nova posição horizontal (nx)
    // - for igual ou maior que zero
    // - estiver ainda nos limites das colunas da grid
    //Assim como a posição vertial (ny)
    let neighbor:Terrain = terrain;
    if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) neighbor = world[ny][nx].terrain;

    //Se o terreno na nova posição for igual ao terreno ativo
    if (neighbor !== transition) {
      mask |= bit;
    }
  }
  return mask;
}

export function getTransitionTile(mask: number):string {
  const N  = mask & 1;
  const NE = mask & 2;
  const E  = mask & 4;
  const SE = mask & 8;
  const S  = mask & 16;
  const SW = mask & 32;
  const W  = mask & 64;
  const NW = mask & 128;

  // Bordas simples
  if (!N && S && E && W) return "border_top";
  if (!S && N && E && W) return "border_bottom";
  if (!E && W && N && S) return "border_right";
  if (!W && E && N && S) return "border_left";

  // Diagonais puras
  if (!NE && N && E) return "corner_top_right";
  if (!NW && N && W) return "corner_top_left";
  if (!SE && S && E) return "corner_bottom_right";
  if (!SW && S && W) return "corner_bottom_left";

  // Quinas internas (em L)
  if (!N && !E && S && W) return "inner_top_right";
  if (!N && !W && S && E) return "inner_top_left";
  if (!S && !E && N && W) return "inner_bottom_right";
  if (!S && !W && N && E) return "inner_bottom_left";
  
  return "full"; // default (nenhum vizinho diferente)
}

export const grassTiles:Record<string,number> = {
  border_top: 2,
  border_bottom: 102,
  border_left: 50,
  border_right: 54,
  corner_top_left: 26,
  corner_top_right: 28,
  corner_bottom_left: 76,
  corner_bottom_right: 78,
  inner_top_left: 1,
  inner_top_right: 3,
  inner_bottom_left: 101,
  inner_bottom_right: 103,
  full: 52
};

export const dirtTiles:Record<string,number> = {
  border_top: 2,
  border_bottom: 102,
  border_left: 50,
  border_right: 54,
  corner_top_left: 26,
  corner_top_right: 28,
  corner_bottom_left: 76,
  corner_bottom_right: 78,
  inner_top_left: 1,
  inner_top_right: 3,
  inner_bottom_left: 101,
  inner_bottom_right: 103,
  full: 52
};
