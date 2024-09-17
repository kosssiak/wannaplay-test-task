import { Easing } from "@tweenjs/tween.js";
import { App } from "..";
import { Sprite } from "./Core/RenderElements/Sprite";

export class Background extends Sprite {

    constructor(config) {
        super(config);
        this.node.scale.set(1);
        this.node.alpha = 0.3;
    }
    
    lightBg() {
        this.tweens.to(this.node, { alpha: 0.7 }, 1500, { easing : Easing.Quadratic.InOut });
    }

    darkBg() {
        this.tweens.to(this.node, { alpha: 0.3 }, 1000, { easing : Easing.Quadratic.InOut });
    }

    protected onResize() {
        const x = App.size.width / 2;
        const y = App.size.height / 2;
        this.node.position.set(x, y);
    }
}