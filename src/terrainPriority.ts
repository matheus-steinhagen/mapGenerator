import type { Terrain } from "./type";

export const terrainPriority: Terrain[] = ["water", "mud", "grass"];

export function getDominantTerrain(a: Terrain, b: Terrain):Terrain{
    return terrainPriority.indexOf(a) < terrainPriority.indexOf(b) ? a : b;
}