import { Graphics } from "pixi.js";
import { Container } from "./Core/RenderElements/Container";
import { Sprite } from "./Core/RenderElements/Sprite";
import { Easing } from "@tweenjs/tween.js";
import { App } from "..";
import { Finger } from "./Finger";

const elementConfig = {
    children: {
        popupBg: { texture: 'startPopup/popupBg', scale: 0.9 },
        text: {
            texture: 'startPopup/text',
            y: -10,
            children: {
                maskHolder: { class: Container }
            }
        },
    }
}

export class StartPopup extends Container {

    protected text: Sprite;
    protected maskHolder: Container;
    protected rectTop: Graphics;

    constructor(config) {
        super({ ...elementConfig, ...config });
        this.text = this.child('text');
        this.maskHolder = this.text.child('maskHolder');
        this.createMaskRects();

    }

    protected createMaskRects() {
        this.rectTop = this.createRect(-1460, -60, 1000, 120);

        this.maskHolder.node.addChild(this.rectTop);
        this.text.node.mask = this.maskHolder.node;
    }

    protected createRect(x: number, y: number, width: number, height: number): Graphics {
        const rect = new Graphics();
        rect.beginFill(0xff0000);
        rect.drawRect(x, y, width, height);
        rect.endFill();
        return rect;
    }

    async animate() {
        const scaleTo = this.getScale();
        this.text.node.scale.set(1.2);
        this.node.scale.set(1.5);
        this.node.alpha = 0;
        this.tweens.to(this.node, { alpha: 1 }, 300, { easing : Easing.Quadratic.InOut });
        await this.tweens.to(this.node.scale, { x: scaleTo, y: scaleTo }, 400, { easing : Easing.Quadratic.InOut });
        await this.tweens.to(this.rectTop, { x: 1000 }, 1500, { easing : Easing.Quadratic.InOut });
        this.tweens.to(this.text.node.scale, { x: 1.25, y: 1.25 }, 2000, { easing : Easing.Quadratic.InOut, yoyo: true, repeat: Infinity });
        await this.tweens.wait(400);

    }

    async hideAnimation() {
        this.tweens.to(this.node, { alpha: 0 }, 350, { easing : Easing.Quadratic.InOut });
        await this.tweens.to(this.node.scale, { x: 0, y: 0 }, 400, { easing : Easing.Quadratic.InOut });
        this.hide();
    }

    protected onResize(): void {
        let scale = this.getScale();

        this.node.scale.set(scale);
    }

    getScale(): number {
        let scale = 1;

        if (App.isPortrait()) {
            if (App.screenType === 'S') {
                scale = 0.8;
            } else if (App.screenType === 'M') {
                scale = 1;
            } else if (App.screenType === 'L') {
                scale = 1.2;
            }
        } else {
            if (App.screenType === 'S') {
                scale = 1.1;
            } else if (App.screenType === 'M') {
                scale = 1.1;
            } else if (App.screenType === 'L') {
                scale = 1.2;
            }
        }

        return scale;
    }
}