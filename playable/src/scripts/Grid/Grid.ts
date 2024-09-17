import { App } from '../..';
import { Easing } from '@tweenjs/tween.js';
import { Cell } from '../Cell';
import { InitialConfig } from '../Const';
import { Container } from '../Core/RenderElements/Container';
import { GridFactory } from './GridFactory';
import { Finger } from '../Finger';
import { Item } from './Item';

const elementConfig = {
    children: {
        cellsHolder: { class: Container },
        fingerHolder: { class: Container, id: 'fingerHolder' },
        finger: { class: Finger, id: 'finger', visible: false },
        animationLayer: { class: Container }
    }
};

export class Grid extends Container {

    private _cells: Cell[];
    protected cellsHolder: Container;
    protected _fingerHolder: Container;
    protected finger: Finger;
    public animationLayer: Container;

    get cells() { return this._cells; };

    get fingerHolder() { return this._fingerHolder; };

    constructor(config) {
        super({ ...elementConfig, ...config });
        this.cellsHolder = this.child('cellsHolder');
        this._fingerHolder = this.child('fingerHolder');
        this.finger = this.child('finger');
        this.animationLayer = this.child('animationLayer');
        this.animationLayer.node.scale.set(0.7);
        this.init();
    }

    protected onResize(): void {
        let scale = 1;
        if (App.isPortrait()) {
            if (App.screenType === 'S') {
                scale = 0.85;
            } else if (App.screenType === 'M') {
                scale = 1;
            } else if (App.screenType === 'L') {
                scale = 1.15;
            }
        } else {
            if (App.screenType === 'S') {
                scale = 0.8;
            } else if (App.screenType === 'M') {
                scale = 0.9;
            } else if (App.screenType === 'L') {
                scale = 1.15;
            }
        }

        this.node.scale.set(scale);
    }

    checkCellByCoordinates(x: number, y: number): boolean {
        let check: boolean = false;
        this._cells.forEach(cell => {
            if (cell.gridX === x && cell.gridY === y) {
                if (cell.rect.alpha === 1) {
                    check = true;
                }
            }
        });
        return check;

    }

    getCellByCoordinates(x: number, y: number): Cell {

        let cellToReturn: Cell = null;
        this._cells.forEach(cell => {
            if (cell.gridX === x && cell.gridY === y) {
                cellToReturn = cell;
            }
        });
        return cellToReturn;
    }

    public init(): void {
        this.createGrid();
        this.createFinger();
        this.centrize();
    }

    protected centrize(): void {
        const pivotX = this.node.width / 2 - 20;
        const pivotY = this.node.height / 2 - 20;

        this.node.pivot = { x: pivotX, y: pivotY };
    }

    createFinger(): void {
        this._fingerHolder.addChild(this.finger);
    }

    showGridFinger(): void {
        this.finger.showFinger();
    }

    hideGridFinger(): void {
        this.finger.hide();
    }

    darkGridTutorial(): void {

        this._cells.forEach(cell => {
            if (cell.gridY !== 3 || (cell.gridY === 3 && !(cell.gridX === 1 || cell.gridX === 2 || cell.gridX === 3 || cell.gridX === 4))) {
                this.tweens.to(cell.node, { alpha: 0.2 }, 1000, { easing: Easing.Quadratic.InOut });
            }
            if (cell.gridY === 3 && cell.gridX === 4) {
                cell.item.node.interactive = true;
            }
        });

    }

    darkGrid(): void {
        this._cells.forEach(cell => {
            if (cell.node) {
                this.tweens.to(cell.node, { alpha: 0.3 }, 1000, { easing: Easing.Quadratic.InOut });
            }

            if (cell.item && cell.item.node) {
                cell.item.node.interactive = false;
            }
        });
    }


    lightGrid(): void {
        this._cells.forEach(cell => {
            this.tweens.to(cell.node, { alpha: 1 }, 1000, { easing: Easing.Quadratic.InOut });
            cell.item.node.interactive = true;
        });
    }

    createGrid(): void {
        this._cells = GridFactory.createGrid(InitialConfig);
        this._cells.forEach(cell => this.cellsHolder.addChild(cell));
    }

    lock(): void {
        this.cells.forEach(cell => {
            if (cell.item) {
                cell.item.node.interactive = false;
            }
        });
    }

    unlock(): void {
        this.cells.forEach(cell => {
            if (cell.item) {
                cell.item.node.interactive = true;
            }
        });
    }

    async swap(item1: Item, item2: Item): Promise<void> {
        item1.changeParent(this.animationLayer);
        item2.changeParent(this.animationLayer);
        const item1NewPosition = item2.node.position;
        const item2NewPosition = item1.node.position;
        item1.tweens.to(item1.node, { x: item1NewPosition.x, y: item1NewPosition.y }, 250);
        return item2.tweens.to(item2.node, { x: item2NewPosition.x, y: item2NewPosition.y }, 250);
    }
}