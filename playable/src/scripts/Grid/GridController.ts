import { App } from '../..';
import { Item } from './Item';
import { Grid } from './Grid';
import { GridEvents } from './GridEvents';
import { Easing } from '@tweenjs/tween.js';
import { Cell } from '../Cell';
import { filters, Point } from 'pixi.js';
import { AnimatedSprite } from '../Core/RenderElements/AnimatedSprite';
import { GridConfig, NewItems } from '../Const';
import { TweensEase } from '../Core/TweenEase';

export class GridController {                               // Class made to control the grid and to process events like merge

    protected grid: Grid;
    protected gridConfig: string[][] = [];
    protected previousItem: Item;
    protected newItems: string[];

    constructor(grid: Grid) {
        this.grid = grid;
        this.gridConfig = GridConfig;
        this.newItems = [...NewItems];
        this.previousItem = this.setFirstTouchedItem();
        this.setEvents();
    }

    protected setEvents() {
        App.on(GridEvents.ITEM_POINTER_DOWN.toString(), item => this.onItemClick(item));
    }

    protected setFirstTouchedItem(): Item {
        let firstItem: Item = null;
        const cells = this.grid.cells;
        for (let i = 0; i < cells.length; i++) {
            const cell = cells[i];
            const item = cell.item;
            if (!item) continue;
            if (cell.gridX === 4 && cell.gridY === 3) {
                firstItem = cell.item;
            }
        }
        return firstItem;
    }

    protected async onItemClick(clickedItem: Item) {
        const cells = this.grid.cells;
        const clickedSides: { side: string, value: boolean }[] = this.checkClickedNeighbours(clickedItem);

        if (clickedItem !== this.previousItem) {    // нажатие на другой элемент

            if (clickedSides[0]) {
                if (this.previousItem.cell) {
                    this.previousItem.cell.hideRect();
                }

                const originalPositions: {
                    x: number,
                    y: number
                }[] = this.getOriginalPositions(clickedItem, clickedSides[0].side);
                await this.swapItems(clickedItem, clickedSides[0].side);

                const mergedItems: { x: number, y: number }[] = this.checkMerge(this.gridConfig);

                if (mergedItems.length === 0) {
                    await this.returnItems(originalPositions);
                } else {
                    App.emit(GridEvents.MERGE.toString());
                    await this.deleteMergedItems(mergedItems);
                    await this.addNewItems();
                    const newMergedItems: { x: number, y: number }[] = this.checkMerge(this.gridConfig);
                    if (newMergedItems.length !== 0) {
                        App.emit(GridEvents.MERGE.toString());
                        await this.deleteMergedItems(newMergedItems);
                        await this.addNewItems();
                    }
                }

            } else {
                if (this.previousItem.cell) {
                    this.previousItem.cell.hideRect();
                }
                if (clickedItem.cell) {
                    clickedItem.cell.animateRect();
                }
                this.previousItem = clickedItem;
            }

        } else if (clickedItem === this.previousItem) {
            if (clickedItem.cell) {
                clickedItem.cell.animateRect();
            }
            this.previousItem = clickedItem;
        }
    }


    protected async deleteMergedItems(mergedItems: { x: number, y: number }[]) {
        for (let i = 0; i < mergedItems.length; i++) {
            const cellToClear = this.grid.getCellByCoordinates(mergedItems[i].x, mergedItems[i].y);

            this.fxAnimation(cellToClear.node.position);
            cellToClear.removeItem();
        }
        await this.grid.tweens.wait(500);
        this.updateGridConfig();
        this.shiftItemsDown(mergedItems);
    }

    protected async addNewItems() {

        const emptyCells: { x: number, y: number }[] = [];

        for (let y = 0; y < this.gridConfig.length; y++) {
            for (let x = 0; x < this.gridConfig[0].length; x++) {
                if (this.gridConfig[y][x] === '') {
                    emptyCells.push({ x, y });
                }
            }
        }

        for (const cellCoords of emptyCells) {
            if (NewItems.length === 0) break;

            const itemType = NewItems.shift();
            const cell = this.grid.getCellByCoordinates(cellCoords.x, cellCoords.y);

            if (cell && itemType) {
                const item = this.createItem(itemType, cell);
                cell.addItem(item);

                item.node.scale.set(0);
                item.tweens.to(item.node.scale, { x: 1, y: 1 }, 400, { easing: TweensEase.getBackOut(1.8) });
            }
        }

        this.updateGridConfig();
    }

    protected async shiftItemsDown(mergedItems: { x: number, y: number }[]) {
        const cols = this.gridConfig[0].length;

        for (let x = 0; x < cols; x++) {

            const emptyCells = mergedItems
                .filter(item => item.x === x)
                .map(item => item.y)
                .sort((a, b) => b - a);

            console.log('EMPTY CELLS', emptyCells);

            if (emptyCells.length > 0) {
                for (let i = 0; i < emptyCells.length; i++) {
                    let emptyY = emptyCells[i];

                    for (let y = emptyY - 1; y >= 0; y--) {
                        const cellAbove = this.grid.getCellByCoordinates(x, y);
                        const aboveItem = cellAbove.item;

                        if (aboveItem) {
                            const emptyCell = this.grid.getCellByCoordinates(x, emptyY);

                            emptyCell.addItem(aboveItem);
                            aboveItem.node.position.set(0, 0);
                            cellAbove.removeItem();

                            emptyCell.item.tweens.to(
                                emptyCell.item.node.position,
                                { x: 0, y: 0 },
                                250,
                                { easing: Easing.Quadratic.InOut }
                            );

                            emptyY--;
                        }
                    }
                }
            }
        }

        this.updateGridConfig();
    }

    protected checkClickedNeighbours(clickedItem: Item): { side: string, value: boolean }[] {

        const clickedSide: { side: string, value: boolean }[] = [];
        console.log('ClickedItem', clickedItem);

        const leftCell: boolean = this.grid.checkCellByCoordinates(clickedItem.cell.gridX - 1, clickedItem.cell.gridY);
        const rightCell: boolean = this.grid.checkCellByCoordinates(clickedItem.cell.gridX + 1, clickedItem.cell.gridY);
        const upCell: boolean = this.grid.checkCellByCoordinates(clickedItem.cell.gridX, clickedItem.cell.gridY - 1);
        const downCell: boolean = this.grid.checkCellByCoordinates(clickedItem.cell.gridX, clickedItem.cell.gridY + 1);

        if (leftCell) {
            clickedSide.push({ side: 'left', value: leftCell });
        }
        if (rightCell) {
            clickedSide.push({ side: 'right', value: rightCell });
        }
        if (upCell) {
            clickedSide.push({ side: 'up', value: upCell });
        }
        if (downCell) {
            clickedSide.push({ side: 'down', value: downCell });
        }

        return clickedSide;
    }

    protected getOriginalPositions(selectedItem: Item, clickedSide: string): { x: number, y: number }[] {
        let clickedCell: Cell = null;

        if (clickedSide === 'left') {
            clickedCell = this.grid.getCellByCoordinates(selectedItem.cell.gridX - 1, selectedItem.cell.gridY);
        }
        if (clickedSide === 'right') {
            clickedCell = this.grid.getCellByCoordinates(selectedItem.cell.gridX + 1, selectedItem.cell.gridY);
        }
        if (clickedSide === 'up') {
            clickedCell = this.grid.getCellByCoordinates(selectedItem.cell.gridX, selectedItem.cell.gridY - 1);
        }
        if (clickedSide === 'down') {
            clickedCell = this.grid.getCellByCoordinates(selectedItem.cell.gridX, selectedItem.cell.gridY + 1);
        }

        if (!clickedCell || !clickedCell.item) {
            return [];
        }

        return [
            { x: selectedItem.cell.gridX, y: selectedItem.cell.gridY },
            { x: clickedCell.gridX, y: clickedCell.gridY }
        ];
    }


    protected async swapItems(selectedItem: Item, clickedSide: string) {
        let clickedCell: Cell = null;

        if (clickedSide === 'left') {
            clickedCell = this.grid.getCellByCoordinates(selectedItem.cell.gridX - 1, selectedItem.cell.gridY);
        } else if (clickedSide === 'right') {
            clickedCell = this.grid.getCellByCoordinates(selectedItem.cell.gridX + 1, selectedItem.cell.gridY);
        } else if (clickedSide === 'up') {
            clickedCell = this.grid.getCellByCoordinates(selectedItem.cell.gridX, selectedItem.cell.gridY - 1);
        } else if (clickedSide === 'down') {
            clickedCell = this.grid.getCellByCoordinates(selectedItem.cell.gridX, selectedItem.cell.gridY + 1);
        }

        if (!clickedCell || !clickedCell.item || !selectedItem.cell) {
            return;
        }

        const neighbourItem = clickedCell.item;
        const selectedCell = selectedItem.cell;

        await this.grid.swap(selectedCell.item, clickedCell.item);

        clickedCell.item.node.position.set(0, 0);
        selectedCell.item.node.position.set(0, 0);

        clickedCell.removeItem();
        selectedCell.removeItem();

        clickedCell.addItem(selectedItem);
        selectedCell.addItem(neighbourItem);

        this.updateGridConfig();
    }


    protected async returnItems(originalPositions: { x: number, y: number }[]) {
        if (originalPositions.length < 2) {
            return;
        }

        const [position1, position2] = originalPositions;

        const cell1 = this.grid.getCellByCoordinates(position1.x, position1.y);
        const cell2 = this.grid.getCellByCoordinates(position2.x, position2.y);

        if (!cell1 || !cell2) {
            return;
        }

        const item1 = cell1.item;
        const item2 = cell2.item;

        if (!item1 || !item2) {
            return;
        }

        cell1.item.tweens.to(cell1.item.node, { alpha: 0 }, 500, { easing: Easing.Quadratic.InOut });
        cell2.item.tweens.to(cell2.item.node, { alpha: 0 }, 500, { easing: Easing.Quadratic.InOut });

        cell1.removeItem();
        cell2.removeItem();

        cell1.addItem(item2);
        cell2.addItem(item1);

        await cell1.item.tweens.to(cell1.item.node, { alpha: 1 }, 500, { easing: Easing.Quadratic.InOut });
        cell2.item.tweens.to(cell2.item.node, { alpha: 1 }, 500, { easing: Easing.Quadratic.InOut });

        this.updateGridConfig();
    }


    protected updateGridConfig() {
        for (let y = 0; y < this.gridConfig.length; y++) {
            for (let x = 0; x < this.gridConfig[0].length; x++) {
                const cell = this.grid.getCellByCoordinates(x, y);

                if (cell && cell.item) {
                    this.gridConfig[y][x] = cell.item.type;
                } else {

                    this.gridConfig[y][x] = '';
                }
            }
        }
    }

    protected checkMerge(gridConfig: string[][]): { x: number, y: number }[] {
        const rows = gridConfig.length;
        const cols = gridConfig[0].length;

        const matches: { x: number, y: number }[] = [];

        for (let i = 0; i < rows; i++) {
            let count = 1;
            for (let j = 1; j < cols; j++) {
                if (gridConfig[i][j] === gridConfig[i][j - 1]) {
                    count++;
                } else {
                    if (count >= 3) {
                        for (let k = j - count; k < j; k++) {
                            matches.push({ x: k, y: i });
                        }
                    }
                    count = 1;
                }
            }

            if (count >= 3) {
                for (let k = cols - count; k < cols; k++) {
                    matches.push({ x: k, y: i });
                }
            }
        }

        for (let j = 0; j < cols; j++) {
            let count = 1;
            for (let i = 1; i < rows; i++) {
                if (gridConfig[i][j] === gridConfig[i - 1][j]) {
                    count++;
                } else {
                    if (count >= 3) {
                        for (let k = i - count; k < i; k++) {
                            matches.push({ x: j, y: k });
                        }
                    }
                    count = 1;
                }
            }

            if (count >= 3) {
                for (let k = rows - count; k < rows; k++) {
                    matches.push({ x: j, y: k });
                }
            }
        }

        return matches;
    }

    protected async fxAnimation(position: Point) {              // Sequence animation
        const fx = new AnimatedSprite({ count: 14, textureName: 'fx', speed: 0.6, scale: { x: 1, y: 1 } });
        const colorFilter = new filters.ColorMatrixFilter();
        colorFilter.tint(0xccfffc);
        colorFilter.brightness(2.5, true);
        fx.node.filters = [colorFilter];
        fx.node.position = position;
        this.grid.addChild(fx);

        await fx.play();
        this.grid.removeChild(fx);
    }

    protected isCellsEmpty(): Boolean {
        return this.grid.cells.every(cell => cell.item == null);
    }

    protected createItem(type: string, cell: Cell) {
        const texture = `items/${ type }`;
        const item = new Item({ type, texture, cell });
        return item;
    }

}