# 🌍 Gerador de Mapas 2D com Tiles — TypeScript + Canvas

Este projeto é um gerador de mapas 2D aleatórios feito com **TypeScript**, **HTML Canvas** e **tilesets gráficos**.
Cada célula do mundo representa um tipo de terreno (`grama`, `água`, `lama`), e o sistema renderiza cada tile visualmente a partir de imagens.

## 🧠 Objetivo

🏗️ Explorar Arquitetura de Software escalável
💻 Aprimorar habilidades com JavaScript, TypeScript, JSON
Criar um sistema didático e visualmente funcional de geração de mundos aleatórios 2D, com foco em:
- Mundo procedural realista
- Tiles com transições suaves
- Modularização com tipos e JSON
- Visualização clara com canvas


## 🔧 Recursos já implementados

- Geração de mapa 2D procedural usando Perlin Noise
- Refatoração da arquitetura com Render e Grid separados
- Terrenos modularizados via arquivos JSON individuais
- Transições suaves entre terrenos com bitmasking
- Suporte a tiles animados (ex: grama balançando, água ondulando)
- Camadas separadas: terreno, transição e objetos
- Objetos com probabilidade de ocorrência (e.g., arbustos, flores)
- Carregamento dinâmico de imagens (apenas as necessárias)
- Renderização eficiente com múltiplos tilesets
- Arquitetura escalável para futuros biomas e efeitos

## 📈 Próximos passos

- Agrupamento natural de vegetação (padrões realistas)
- Sistema de sombra e iluminação por tile
- Simulação de clima (chuva, neve, vento)
- Suporte a entidades móveis (player, NPCs, inimigos)
- Movimentação no mapa e scroll de câmera
- Mini-mapa e visualização de debug
- Exportação/importação de mapas salvos
- Interface para seleção de terrenos/biomas antes da geração


## 🛠 Tecnologias Usadas

- **TypeScript**
- **HTML5 Canvas**
- **Tileset gráfico** com imagens PNG (32x32 ou 16x16)
- **JavaScript DOM API**
- Gerenciado com **Vite**


## 🧱 Estrutura do Projeto

```
📦 mapGenerator
├── index.html
├── main.ts
├── /assets
│   ├── Floors_Tiles.png
│   └── Water_Tiles.png
├── /public
├── README.md
└── CHANGELOG.md
```

🚀 Como rodar o projeto


```
git clone https://github.com/matheus-steinhagen/mapGenerator
cd world-generator
npm install
npm run dev
```
Acesse o projeto em: http://localhost:5173

## 📦 Requisitos
Node.js v18 ou superior
Navegador moderno com suporte a ES Modules

## 🧠 Dica para Contribuintes
Você pode clonar a branch main e iniciar sua própria linha de evolução!

> Em breve: CONTRIBUTING.md com:
> - Regras de estilo e arquitetura
> - Como adicionar novos tipos de células
> - Como criar novos agentes e comportamentos

## 👨‍💻 Autor
Matheus Steinhagen - Desenvolvedor autodidata com foco em:

- 🧱 Arquitetura de Software
- 🧠 Inteligência Artificial Aplicada
- 🔐 Cibersegurança e minimalismo digital

## 📄 Licença
MIT — Este projeto é livre para estudo, uso e modificação.
Créditos são sempre bem-vindos!
