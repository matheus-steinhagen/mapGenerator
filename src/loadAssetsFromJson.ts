import type { Terrain, TerrainData} from "./type";

//Estruturas a serem abertas
//  Terrain
//  Transições
//  Objetos
//  Muros
//  Agente

export async function loadAssetsFromJSON(terrains: Terrain[]): Promise<{
    terrainDataMap: Map<Terrain, TerrainData>,
    imageMap: Map<string, HTMLImageElement>
}> {
    const imagesToLoad = new Set<string>();
    const terrainDataMap = new Map<Terrain, TerrainData>();

    // Carregar terrenos
    for (const terrain of terrains) {
        const response = await fetch(`/data/terrains/${terrain}.json`);
        const data: TerrainData = await response.json();
        terrainDataMap.set(terrain, data);

        imagesToLoad.add(data.terrain.tileSet);
        if (data.transition) {
            imagesToLoad.add(data.transition['tileSet']);
        }
        if (data.objects) {
            for (const obj of data.objects) {
                imagesToLoad.add(obj.tileSet);
            }
        }
    }

    // Carregar imagens
    const imageMap = new Map<string, HTMLImageElement>();
    for (const src of imagesToLoad) {
        const img = new Image();
        img.src = `/assets/${src}`;
        await img.decode();
        imageMap.set(src, img)
    }
    return {
        terrainDataMap,
        imageMap
    }
}