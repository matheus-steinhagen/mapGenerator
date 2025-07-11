/**
 * Ruído de Perlin
 * ====================
 * Calcula vetores de influência nos cantos e uma célula.
 *  > Interpola suavemente esses valores
 *      - A transição de um ponto se torna contínua
 */

/**
 * PERMUTATION TABLE
 * ====================
 * Fonte de entropia, aleatoriedade determinística - Gerar vetores de gradientes únicos por célula
 * Vetor de 256 números (0 a 255)
 * Rearranjados em uma ordem pseudoaleatória
 * Sem repetiçao
 */
const permutation = [
  151,160,137,91,90,15,
  131,13,201,95,96,53,194,233,7,225,
  140,36,103,30,69,142,8,99,37,240,21,10,23,
  190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,
  35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,
  168, 68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,
  111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
  102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208,
  89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,
  186, 3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,
  82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,
  183,170,213,119,248,152, 2,44,154,163,70,221,153,101,155,167,
  43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,
  185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,
  179,162,241, 81,51,145,235,249,14,239,107,49,192,214,31,181,
  199,106,157,184,84,204,176,115,121,50,45,127, 4,150,254,138,
  236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215
];
const p = [...permutation, ...permutation];

/**
 * Linear Interpolation
 * ====================
 * Coração do ruído de Perlin
 * Mistura valores suavemente com base no fator t
 *  > O fator t varia de 0 a 1
 * 
 * @param a 
 * @param b 
 * @param t 
 * @returns 
 */
function lerp(a: number, b:number, t:number): number{
    return a + t * (b - a);
}

/**
 * Função de suavização
 * ====================
 * Suaviza a transição entre valores
 * A interpolação linear por si só cria bordas duras
 *
 * @param t 
 * @returns 
 */
function fade(t: number):number{
    return t * t * t * (t * (t * 6 - 15) + 10); //Polinômio de grau 5
}

/**
 * Cada célula do espaço tem vetores de gradiente nos cantos
 * O valor do ruído em um ponto é determinado com base
 *  > Nas distâncias do ponto até os cantos das células
 *  > No produto escalar entre essas distÂncias e os vetores de gradiente
 */

/**
 * Gradientes fixos para cada canto
 * ====================
 * Os vetores abaixo representam direções em 2D
 * Cada célula do espaço terá um desses vetores em cada canto
 * Vetores repetidos, porém consistentes para evitar ruído aleatório instável
 */
const grad2D: [number, number][] = [
    [1, 0], [-1, 0], [0, 1], [0, -1],
    [1, 1], [-1, 1], [1, -1], [-1, -1]
]

function gradient(hash: number, x: number, y: number): number {
    const g = grad2D[hash & 7];
    return g[0] * x + g[1] * y;
}

/**
 * PERLIN NOISE
 * ====================
 * Recebe um ponto (x, y) qualquer e retorna um valor suave e contínuo entre -1 e 1
 * Ele usa como base os vetores de gradiente pseudoaleatórios nos cantos das células
 * 
 * @param x 
 * @param y
 * @returns
 */
export function perlin2D(x:number, y:number):number{

    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    //(& 255) Máscara binária - garante X e Y fiquem sempre entre 0 e 255

    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);

    const u = fade(xf);
    const v = fade(yf);

    //Indexação dos vetores gradientes pseudoaleatórios nos 4 cantos da célula
    //p[X] + Y Hash bidimensional - um jeito de misturar X e Y para obter um índice único
    const aa = p[p[X] + Y]; // Duplo acesso à permutação (embaralha duas vezes)
    const ab = p[p[X] + Y + 1];
    const ba = p[p[X + 1] + Y];
    const bb = p[p[X + 1] + Y + 1];
    //As variáveis são os índices que serão usados para determinar os vetores de gradiente

    const x1 = lerp(gradient(aa, xf, yf), gradient(ba, xf - 1, yf), u);
    const x2 = lerp(gradient(ab, xf, yf - 1), gradient(bb, xf -1, yf - 1), u);

    return lerp(x1, x2, v);

}