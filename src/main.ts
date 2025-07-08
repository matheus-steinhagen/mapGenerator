import { Grid } from "./Grid";
import { Render } from "./Render";

const grid = new Grid(50, 35);
grid.generate(0.035);

const renderer = new Render(grid.get(), 16);
await renderer.loadTileSets();
renderer.drawWorld();