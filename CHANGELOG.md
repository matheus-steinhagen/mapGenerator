## Versão 1.0 — Primeira versão funcional

### 🛠️ Implementações
- Criação da estrutura principal em TypeScript
- Tipagem clara com `Terrain` e `WorldCell`
- Geração de mapa aleatório com `Math.random()`
- Renderização de mapa usando `HTMLCanvasElement`
- Integração com tileset gráfico (`Floors_Tiles.png` e `Water_Tiles.png`)
- Carregamento de imagens com `Promise.all` para garantir ordem correta
- Cálculo de coordenadas a partir de IDs do Tiled

### 🐛 Correções
- Corrigido problema onde o `drawWorld()` não era chamado (causado por erro de caminho nas imagens)
- Correção das coordenadas incorretas dos tiles no tileset
- Ajustado uso de `drawImage` para não multiplicar `sx` e `sy` desnecessariamente

### 💡 Desafios superados
- Entendimento de como o Tiled gera IDs e como convertê-los em coordenadas de tile
- Depuração do carregamento assíncrono com `onload`
- Visualização direta de tiles ao invés de blocos de cor
