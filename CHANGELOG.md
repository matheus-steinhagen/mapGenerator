# 🗂 CHANGELOG

## Versão 0.2 — Ruído de Perlin

### Novidades
- **Implementação do ruído de Perlin para geração do mapa**
  - Substituição do Math.random() por Perlin Noise para criar padrões naturais e suaves no mapa.
  - Uso do ruído para definir os terrenos (`water`, `mud`, `grass`) com transições mais coerentes visualmente.

### Desafios enfrentados
- Entender a geração e aplicação do Perlin Noise para gerar terrenos coerentes.
- Ajustar a escala e offsets do ruído para obter variações naturais no mapa.
- Integrar a geração procedural ao sistema de renderização existente.

### Soluções adotadas
- Uso da função `perlin2D` para gerar valores contínuos entre -1 e 1, convertidos para faixa 0 a 1.
- Definição de faixas de valores do ruído para categorizar cada célula do mapa em um tipo de terreno específico.
- Configuração dinâmica do canvas conforme as dimensões do mapa.
- Estruturação clara dos dados do mapa (`world`) com o tipo `WorldCell` contendo a propriedade `terrain`.

### Próximos passos (v3)
- Implementar bitmasking para transições suaves entre terrenos (mudanças visuais entre tiles de diferentes terrenos).
- Criar camadas para separar o terreno base das transições e objetos.
- Resolver questões de prioridade e sobreposição nas transições de terreno.


## Versão 0.1 — Primeira versão funcional

**Notas:**
Esta versão foca na melhoria visual e estrutural da geração do mapa, preparando o terreno para transições visuais mais complexas e realistas nas próximas versões.

### Implementações
- Criação da estrutura principal em TypeScript
- Tipagem clara com `Terrain` e `WorldCell`
- Geração de mapa aleatório com `Math.random()`
- Renderização de mapa usando `HTMLCanvasElement`
- Integração com tileset gráfico (`Floors_Tiles.png` e `Water_Tiles.png`)
- Carregamento de imagens com `Promise.all` para garantir ordem correta
- Cálculo de coordenadas a partir de IDs do Tiled

### Correções
- Corrigido problema onde o `drawWorld()` não era chamado (causado por erro de caminho nas imagens)
- Correção das coordenadas incorretas dos tiles no tileset
- Ajustado uso de `drawImage` para não multiplicar `sx` e `sy` desnecessariamente

### Desafios superados
- Entendimento de como o Tiled gera IDs e como convertê-los em coordenadas de tile
- Depuração do carregamento assíncrono com `onload`
- Visualização direta de tiles ao invés de blocos de cor
