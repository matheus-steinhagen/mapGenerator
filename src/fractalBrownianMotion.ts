import { perlin2D } from "./perlinNoise";

/**
 * FRACTAL BROWNIAN MOTION
 * ====================
 * Combina múltiplas camdas de Perlin Noise (octaves)
 * Cada camada (octave) possui frequencias diferentes
 * 
 * @param x 
 * @param y 
 * @param amplitude 
 * @param frequency 
 * @param octaves 
 * @param persistence 
 * @param lacunarity 
 * @returns 
 */

export function fbm2D(
    x: number,
    y: number,
    octaves: number = 4, // Camadas de ruído (4 ~ 6 é ótimo)
    persistence: number = 0.5, // O quando a amplitude diminui a camada
    lacunarity: number = 2, // O quanto a frequencia aumenta por camada 
    amplitude: number = 1,
    frequency: number = 1,
): number {
    let total = 0;
    let maxAmplitude = 0; // Usado para normalizar entre -1 e 1

    for(let i = 0; i < octaves; i++){
        const noise = perlin2D(x * frequency, y * frequency);
        total += noise * amplitude;

        maxAmplitude += amplitude;
        amplitude *= persistence;
        frequency *= lacunarity;
    }

    return total / maxAmplitude;
}