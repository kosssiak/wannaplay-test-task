import { App } from "../..";
import { Easing, Tween } from "@tweenjs/tween.js";
import { Sprite } from "../Core/RenderElements/Sprite";
import { GridEvents } from "./GridEvents";
import { Cell } from "../Cell";
import { Point } from "pixi.js";
import { GameEvents } from "../GameEvents";

export class Item extends Sprite {                          // Class for items

    private eventData: any;
    private startPosition: { x: number, y: number };
    protected _type: string;
    protected _cell: Cell;

    get type() { return this._type };
    get cell() { return this._cell };

    set cell(value: Cell) { this._cell = value };

    constructor(config) {
        super(config);
        this._type = config.type;
        this.cell = config.cell;
        this.init();
    }

    async returnToStartPosition(position: Point): Promise<any> {
        this.lock();
        await this.tweens.to(this.node.position, position, 300, { easing : Easing.Quadratic.InOut });
        this.unlock();
        return Promise.resolve();
    }

    complete(): void {
        this.hide();
    }

    lock() {
        this.node.interactive = false;
    }

    unlock() {
        this.node.interactive = true;
    }

    private init(): void {
        this.startPosition = { x: this.node.x, y: this.node.y };

        this.node.interactive = true;
        this.setEvents();
    }

    private setEvents(): void {

        this.node
            .on('pointerdown', event => this.onItemClicked(event))

    }

    private onItemClicked(event): void {
        
        App.emit(GameEvents.START_GAME.toString(), this);
        App.emit(GridEvents.ITEM_POINTER_DOWN.toString(), this);

        this.eventData = event.data;
    }

    disappear(): Promise<void> {
        return this.tweens.to(this.node.scale, { x: 0, y: 0 }, 250, { easing : Easing.Quadratic.InOut });
    }
}
