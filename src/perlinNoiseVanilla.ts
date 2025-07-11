/**
 * Ruído de Perlin
 * ====================
 * Calcula vetores de influência nos cantos e uma célula.
 *  > Interpola suavemente esses valores
 *      - A transição de um ponto se torna contínua
 */

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

/**
 * Produto escalar entre o vetor gradiente e a distância ao ponto
 * ====================
 * Calcula o produto escalar entre
 *  > o vetor distância e,
 *  > o vetor gradiente
 *
 * @param ix 
 * @param iy //Coordenadas da celula
 * @param x 
 * @param y //Coordenadas do ruído
 * @returns 
 */
function dotGridGradient(ix: number, iy: number, x: number, y: number): number {

    //Vetor de distância do ponto até o canto
    const dx = x - ix;
    const dy = y - iy;

    //Selecionar um vetor gradiente pseudoaleatório (fixo para consistência)
    //  Forma simples de garantir que a coordenada das células sempre produza o mesmo vetor gradiente
    const index = (ix + iy * 57) % grad2D.length; //Multiplicar iy por um número primo (como 57) reduz colisões
    const grad = grad2D[Math.abs(index)];

    //Produto escalar entre o vetor de distância e o vetor gradiente
    return dx * grad[0] + dy * grad[1];
}

/**
 * - Descobre em que célula o ponto (x, y) está
 * - Calcula os vetores distânci para os 4 cantos da célula
 * - Usa `dotGridGradient()` para pegar a influência de cada canto
 * - Suaviza os fatores com `fade()`
 * - Usa `lerp()` duas vezes para interpolar entre os 4 valores e retorna o valor final
 * 
 * @param x 
 * @param y
 * @returns
 */
export function perlin2D(x:number, y:number):number{

    //Encontra a célula que contém o ponto
    const x0 = Math.floor(x);
    const x1 = x0 + 1;
    const y0 = Math.floor(y);
    const y1 = y0 + 1;

    //Distâncias relativas dentro da célula
    const sx = x - x0;
    const sy = y - y0;

    //Calculo da influência dos cantos
    //  Produto escalar entre o vetor gradiente e vetor distância nos 4 cantos da célula
    //  4 chamadas, que representam os 4 cantos da célula em que o ponto (x, y) está
    const n0 = dotGridGradient(x0, y0, x, y); //Canto inferior esquerdo
    const n1 = dotGridGradient(x1, y0, x, y); //Canto inferior direito
    const n2 = dotGridGradient(x0, y1, x, y); //Canto superior esquerdo
    const n3 = dotGridGradient(x1, y1, x, y); //Canto superior direito

    //Suaviza as distâncias relativas (sx e sy)
    //  Evita que o ruído tenha "degraus" ou transições bruscas
    //  u e v serão usados como fatores de interpolação
    const u = fade(sx);
    const v = fade(sy);

    //Interpola horizontalmente os valores da linha inferior (n0 e n1) e a linha superior (n2 e n3)
    //  u controla o quanto avançamos para a direita
    const ix0 = lerp(n0, n1, u);
    const ix1 = lerp(n2, n3, u);

    //Interpola verticalmente os dois valores interpolados horizontalmente
    //  v controla a interpolação vertical
    const value = lerp(ix0, ix1, v)

    //O valor retornado está entre aproximadamente -1 e 1
    //  Pode ser usado para gerar texturas, terrenos ou padrões naturais
    return value;
}