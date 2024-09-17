import { Container } from "./Core/RenderElements/Container";
import { Grid } from "./Grid/Grid";
import { StartPopup } from "./StartPopup";
import { ProgressBar } from "./ProgressBar";
import { WinPopup } from "./WinPopup";
import { FailPopup } from "./FailPopup";
import { Counter } from "./Counter";

const elementConfig = {
    children: {
        progressBar: { class: ProgressBar, id: 'progressBar'},                              // ProgressBar to show remaining time
        counter: { class: Counter, id: 'counter' },                                         // Counter to count amount of megred groups of elements
        grid: { class: Grid, id: 'grid', scale: { x: 0.8, y: 0.8 } },                       // Grid to hold and manipulate cells and items
        startPopup: { class: StartPopup, id: 'startPopup', y: -205, visible: false },       // StartPopUp to show tutorial and start game
        winPopup: { class: WinPopup, id: 'winPopup', visible: false },                      // WinPopUp to show if there was a victory
        failPopup: { class: FailPopup, id: 'failPopup', visible: false }                    // FailPopUp to show if there was a failure
    }
}

export class Main extends Container {

    protected grid: Grid;

    constructor(config) {
        super({ ...elementConfig, ...config });
        this.grid = this.child('grid');
    }
    
    protected onResize(): void {
        this.toCenter();
    }
}