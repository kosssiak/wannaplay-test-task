import { Easing } from "@tweenjs/tween.js";
import { Sprite } from "./Core/RenderElements/Sprite";
import { Item } from "./Grid/Item";
import { Graphics } from "pixi.js";

const elementConfig = {
    texture: "cell"
}

export class Cell extends Sprite {                  // Class for cells

    protected _item: Item = null;
    protected _gridX: number = null;
    protected _gridY: number = null;
    protected _rect: Graphics = null;
    
    get item() { return this._item };
    get gridX() { return this._gridX };
    get gridY() { return this._gridY };
    get rect() { return this._rect };
    set item(item: Item) { this._item = item };
    set gridX(x: number) { this._gridX = x };
    set gridY(y: number) { this._gridY = y };

    constructor(config) {
        super({ ...elementConfig, ...config });
        this.addRect();
    }

    addItem(item: Item) {
        this.addChild(item);
        this._item = item;
        item.cell = this;
    }

    removeItem() {
        if (!this.item) return;

        this.removeChild(this.item);
        this._item = null;
    }

    animateRect(){
        this.tweens.to(this._rect, { alpha: 1 }, 200, { easing : Easing.Quadratic.InOut });
        this.tweens.to(this._rect.scale, { x: 1, y: 1 }, 200, { easing : Easing.Quadratic.InOut });
    }

    hideRect(){
        this.tweens.to(this._rect, { alpha: 0 }, 200, { easing : Easing.Quadratic.InOut });
        this.tweens.to(this._rect.scale, { x: 0, y: 0 }, 200, { easing : Easing.Quadratic.InOut });
    }

    addRect(){        
        const bounds = this.node.getBounds();
        this._rect = this.createRect(107, 105, 155, 155, 0xd2691e);
        this._rect.pivot = { x: bounds.width, y: bounds.height };
        this._rect.scale.set(0.92);
        this._rect.alpha = 0;
        this.node.addChild(this._rect);
    }

    createRect(x: number, y: number, width: number, height: number, color: number): Graphics {
        const rect = new Graphics();
        rect.lineStyle(6, color);
        rect.drawRect(x, y, width, height);
        rect.endFill();
        return rect;
    }

    isRectShown(): boolean {
        let rect: boolean = false;
        if (this.rect.alpha === 1){
            rect = true;
        }
        return rect;
    }

    resetCell(){
        this.node.scale.set(0.7, 0.7);
    }

    animateCell() {
        this.node.scale.set(0, 0);
        this.tweens.to(this.node.scale, { x: 0.7, y: 0.7 }, 400, { easing : Easing.Quadratic.InOut });
    }
}