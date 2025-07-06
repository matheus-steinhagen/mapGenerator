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

- Geração de grid 15x15 com células de terreno
- Tipagem com Terrain e WorldCell
- Sorteio aleatório de terrenos com pesos ajustáveis
- Renderização gráfica com drawImage()
- Leitura de tileset via coordenadas absolutas
-Correção do carregamento assíncrono das imagens

## 📈 Próximos passos

- Bitmasking para transições suaves entre terrenos
- Geração por Perlin Noise para formar regiões naturais
- Exportação/importação via JSON
- Layers: terreno base, objetos, entidades, etc.
- Scroll e movimento de câmera
- Mini-map e debug overlay


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
Matheus Steinhagen
Desenvolvedor autodidata com foco em:

🧱 Arquitetura de Software
🧠 Inteligência Artificial Aplicada
🔐 Cibersegurança e minimalismo digital

## 📄 Licença
MIT — Este projeto é livre para estudo, uso e modificação.
Créditos são sempre bem-vindos!
