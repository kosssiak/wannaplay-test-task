import { Cell } from "../Cell";
import { Item } from "./Item";

export class GridFactory {                                  // Class to build a new grid and fill it

    static createGrid(gridConfig: string[][]): Cell[] {
        const cells: Cell[] = [];
        let x = 0;
        let y = 0;
        const offset = -56;

        for (let i = 0; i < gridConfig.length; i++) {
            for (let j = 0; j < gridConfig[i].length; j++) {
                const type = gridConfig[i][j];
                const cell = new Cell({ texture: 'cell' });
                cell.gridX = j;
                cell.gridY = i;
                const item = this.createItem(type, cell);
                x = cell.node.width * j + offset * j;
                y = cell.node.height * i + offset * i;
                cell.node.position.set(x, y);

                cells.push(cell);
                cell.addItem(item);
            }
        }

        return cells;
    }

    static createItem(type: string, cell: Cell) {
        const texture = `items/${type}`;
        const item = new Item({ type, texture, cell });
        return item;
    }
}