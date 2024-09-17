import { Easing } from '@tweenjs/tween.js';
import { Container } from './Core/RenderElements/Container';
import { App } from '..';
import { GameEvents } from './GameEvents';
import { Item } from './Grid/Item';

const elementConfig = {
    children: {
        finger: { texture: 'startPopup/finger', anchor: { x: 0.1, y: 0.1 } },
    }
};

export class Finger extends Container {             // Class for finger which is used for tutorial

    constructor(config) {
        super({ ...elementConfig, ...config });
        this.setEvents();
    }

    async showFinger() {
        this.show();
        this.node.scale.set(0.8);
        this.node.x = 520;
        this.node.y = 380;
        this.node.alpha = 0;
        await this.tweens.to(this.node, { alpha: 1 }, 300, { easing : Easing.Quadratic.InOut });
        this.showFingerAnimation();
    }

    async showFingerAnimation() {
        await this.tweens.to(this.node.scale, { x: 0.65, y: 0.65 }, 300, { easing: Easing.Quadratic.InOut });
        await this.tweens.to(this.node, { x: 380, y: this.node.y }, 300, { easing: Easing.Quadratic.InOut });
        await this.tweens.to(this.node.scale, { x: 0.8, y: 0.8 }, 300, { easing: Easing.Quadratic.InOut });
        await this.tweens.wait(500);
        await this.tweens.to(this.node, { x: 510, y: this.node.y }, 300, { easing: Easing.Quadratic.InOut });
        this.showFingerAnimation();
    }

    async stopFinger() {
        this.tweens.stopAll();
    }

    private setEvents(): void {
        App.once(GameEvents.START_GAME.toString(), this.stopFinger, this);
    }

    protected delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}