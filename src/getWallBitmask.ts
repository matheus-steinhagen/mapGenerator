import type { GridCell, Terrain } from "./type";

const WALL_TERRAIN: Terrain = "dirtWall";

export function getWallBitmask(
    x: number,
    y: number,
    grid: GridCell[][],
    matchWallFlag: boolean
): number {
    const bitmaskDirs = [
        { dx: 0, dy: -1 },   // cima          bit 0 (1)
        { dx: 1, dy: -1 },   // canto sup dir bit 4 (2)
        { dx: 1, dy: 0 },    // direita       bit 1 (4)
        { dx: 1, dy: 1 },    // canto inf dir bit 5 (8)
        { dx: 0, dy: 1 },    // baixo         bit 2 (16)
        { dx: -1, dy: 1 },   // canto inf esq bit 6 (32)
        { dx: -1, dy: 0 },   // esquerda      bit 3 (64)
        { dx: -1, dy: -1 },  // canto sup esq bit 7 (128)
    ];

    let bitmask = 0;

    bitmaskDirs.forEach((dir, bit) => {
        const nx = x + dir.dx;
        const ny = y + dir.dy;

        if (ny >= 0 && ny < grid.length && nx >= 0 && nx < grid[0].length) {

            const neighbor = grid[ny][nx];
            if (neighbor.terrain === WALL_TERRAIN && neighbor.wall === matchWallFlag) bitmask |= 1 << bit;
        }
    });

    return bitmask;
}

export function getWallTileName(mask: number, isWall: boolean): string {
  const N  = mask & 1;
  const NE = mask & 2;
  const E  = mask & 4;
  const SE = mask & 8;
  const S  = mask & 16;
  const SW = mask & 32;
  const W  = mask & 64;
  const NW = mask & 128;

  let tileName = "full"

  // Bordas simples
  if (!N && S && E && W) tileName = "border_top";
  if (!S && N && E && W) tileName = "border_bottom";
  if (!E && W && N && S) tileName = "border_right";
  if (!W && E && N && S) tileName = "border_left";

  // Diagonais puras
  if (!NE && N && E) tileName = "corner_top_right";
  if (!NW && N && W) tileName = "corner_top_left";
  if (!SE && S && E) tileName = "corner_bottom_right";
  if (!SW && S && W) tileName = "corner_bottom_left";

  // Quinas internas (em L)
  if (!N && !E && S && W) tileName = "inner_top_right";
  if (!N && !W && S && E) tileName = "inner_top_left";
  if (!S && !E && N && W) tileName = "inner_bottom_right";
  if (!S && !W && N && E) tileName = "inner_bottom_left";

  if(isWall) tileName += "_wall";
  
  return tileName; // default (nenhum vizinho diferente)
}