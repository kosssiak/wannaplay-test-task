import { Point } from "pixi.js";
import { App } from "../../..";
import { Tweens } from "../Tweens";
import { APP_EVENTS } from "../APP_EVENTS";

export class RenderElement {

    protected config: any;
    private key: string;
    protected children: Map<string, RenderElement>;
    protected _tweens: Tweens;
    protected parent: RenderElement | null;
    protected _node: any;

    get tweens() { return this._tweens };
    get node() { return this._node };

    constructor(config: any) {
        this.config = config;
        this._node = this.createNode();
        this.key = config.key;
        this.children = new Map(); 
        this.parent = null;
        this._tweens = new Tweens(this);

        this.createChildren();
        this.setAttributes();
        App.on(APP_EVENTS.ON_LOAD.toString(), this.onLoad, this);
        App.on(APP_EVENTS.RESIZE.toString(), this.onResize, this);
    }

    onLoad() {

    }

    child(key: string): any {
        return this.children.get(key);
    }

    addChild(child: RenderElement) {
        this.node.addChild(child.node);
        child.parent = this;
    }

    removeChild(child: RenderElement) {
        this.node.removeChild(child.node);
        child.parent = null;
    }

    removeChildren() {
        this.node.children.forEach(child => {
            this.node.removeChild(child);
        });
    }

    protected createNode() {
        
    }

    protected onResize() {
        
    }

    protected createChildren() {
        if (!this.config.children) return;

        const keys = Object.keys(this.config.children);
        keys.forEach(key => {
            const config = this.config.children[key];
            config.key = key;
            const child = App.renderElementsFactrory.createRenderElement(this.config.children[key]);
            this.addChild(child);
            child.parent = this;
            this.children.set(key, child);
        })
    }

    protected setAttributes() {
        this.node.x = this.config.x !== undefined ? this.config.x : 0;
        this.node.y = this.config.y !== undefined ? this.config.y : 0;
        this.node.angle = this.config.angle !== undefined ? this.config.angle : 0;
        this.node.anchor = this.config.anchor !== undefined ? this.config.anchor : { x: 0.5, y: 0.5 };
        this.node.pivot = this.config.pivot !== undefined ? this.config.pivot : { x: 0, y: 0 };
        this.node.alpha = this.config.alpha !== undefined ? this.config.alpha : 1;
        this.node.scale = this.config.scale !== undefined ?
            !isNaN(this.config.scale) ? { x: this.config.scale, y: this.config.scale } : this.config.scale
            : { x: 1, y: 1 };
        if (this.config.visible !== undefined) this.node.visible = this.config.visible;
    }

    hide() {
        this.node.visible = false;
    }

    show() {
        this.node.visible = true;
    }

    public changeParent(parent: RenderElement): void {
        const position = parent.getLocalPositionFor(this);
        parent.addChild(this);
        this.node.position.set(position.x, position.y);
    }

    public getLocalPositionFor(sprite: RenderElement): { x: number, y: number } {
        return this.node.toLocal(sprite.node.parent.toGlobal(sprite.node.position));
    }

    checkCollision(object2: RenderElement) {
        const object1Bounds = this.node.getBounds();
        const object2Bounds = object2.node.getBounds();

        return (
            object1Bounds.x + object1Bounds.width > object2Bounds.x &&
            object1Bounds.x < object2Bounds.x + object2Bounds.width &&
            object1Bounds.y + object1Bounds.height > object2Bounds.y &&
            object1Bounds.y < object2Bounds.y + object2Bounds.height
        );
    }

    toCenter() {
        this.node.pivot = { x: -App.size.width / 2, y: -App.size.height / 2 };
    }
}