# 🗂 CHANGELOG

## Versão 0.5 – Animações, Correções e Arquitetura Escalar (2025-07-11)

### Novidades implementadas

- **Correções automáticas de terreno:**
  - Tiles isolados ou com baixo número de vizinhos agora são ajustados.
  - Corrige erros visuais e evita transições quebradas.
- **Perlin Noise com Fractal Brownian Motion (fBM):**
  - Uso de múltiplas oitavas com `persistence` e `lacunarity`
  - Mapas mais naturais, sem padrões visuais repetitivos
- **Controle manual de thresholds por terreno**, permitindo ajustes finos nas proporções de cada relevo.

### Refatorações importantes

- `Grid.ts` agora:
  - Recebe thresholds dinâmicos
  - Usa `fbm2D()` para suavizar a distribuição de terrenos
- Nova função `terrainCorrections()` no Render:
  - Executa uma varredura em 4 direções para corrigir terrenos isolados
  - Atualiza também a transição correspondente

### Problemas resolvidos

- Corrigido bug de tiles quebrados em lagos ou transições mal aplicadas
- Corrigido erro de objetos sumirem com a chegada da animação
- Evitado que múltiplos objetos sejam aplicados na mesma célula

### Exemplo visual atual

- Transições suaves e consistentes
- Água, grama e lama com regiões naturais
- Mapa com 44x78, renderização clara e estável
- Objetos variados com agrupamentos coerentes

---

## Próxima versão: 0.6 (Terreno Elevado + Objetos Grandes)

**Objetivo:** Implementar geração de elevações (paredes, platôs, planaltos) e suporte a árvores ou estruturas com múltiplos tiles.

## Versão 0.4 — Terrenos modulares, animações e objetos

### Novidades

- Arquitetura baseada em arquivos JSON para cada terreno
- Suporte a animações por frame em terrenos e objetos
- Renderização procedural de objetos com chance de aparição
- Refatoração de `Render` e `Grid` para modularidade e expansão
- Separação de dados por camadas (`terrain`, `transition`, `object`)
- Carregamento dinâmico e automático de imagens associadas

### Destaques técnicos
- `loadTerrainDataFromJSON` carrega e vincula dinamicamente os dados de cada terreno
- `drawObjects`, `drawTransitions` e `drawTerrain` separados
- Tipagem forte (`TerrainData`) com base em arquivos externos
- Pronto para expansão com sombras, agrupamentos e biomas

### Próximos passos (v0.5)
- Agrupamento natural de objetos
- Adição de sombras e iluminação simples
- Transições múltiplas por terreno
- Introdução de biomas compostos

## v0.3 — Estrutura modular com classes Grid e Render

### Novidades
- Refatoração completa da estrutura do projeto
- Criação da classe `Grid` para geração procedural com Perlin Noise
- Criação da classe `Render` para visualização desacoplada
- Canvas gerenciado diretamente na classe `Render` (por ID)
- Separação de responsabilidades: geração x renderização
- Uso do padrão `Partial<Record<Terrain, ...>>` para transições
- Transições de tiles com bitmask e seleção de tile gráfico
- Melhor uso do TypeScript: interfaces e tipos fortes

### Melhorias Técnicas
- Tipagem forte em todas as estruturas do mapa (`GridCell`, `Terrain`, etc.)
- Modularização clara com arquivos separados (`Grid.ts`, `Render.ts`, etc.)
- `tileSize` como variável configurável
- Carregamento assíncrono de imagens controlado por `Promise.all`
- Renderização com `drawBaseLayer()` + `drawTransitionLayer()`

### Próximos passos (v0.4)
- Implementar camadas (base, transição, objetos, entidades)
- Introduzir sistema de biomas com mapas auxiliares (umidade, temperatura)
- Adicionar objetos visuais como árvores, pedras e ruínas

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
