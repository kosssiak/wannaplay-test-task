import { App } from "..";
import { FailPopup } from "./FailPopup";
import { GameEvents } from "./GameEvents";
import { Grid } from "./Grid/Grid";
import { GridEvents } from "./Grid/GridEvents";
import { ProgressBar } from "./ProgressBar";
import { StartPopup } from "./StartPopup";
import { WinPopup } from "./WinPopup";
import { Background } from "./Background";
import { GridController } from "./Grid/GridController";
import { Counter } from "./Counter";

export class GameController {                               // Class made to control and process game events

    private startPopup: StartPopup;
    private grid: Grid;
    private progressBar: ProgressBar;
    private failPopup: FailPopup;
    private winPopup: WinPopup;
    private counter: Counter;
    private bg: Background;
    protected gridController: GridController;

    constructor() {
        this.startPopup = App.getElementByID('startPopup');
        this.grid = App.getElementByID('grid');
        this.progressBar = App.getElementByID('progressBar');
        this.failPopup = App.getElementByID('failPopup');
        this.counter = App.getElementByID('counter');
        this.winPopup = App.getElementByID('winPopup');
        this.bg = App.getElementByID('bg');
        this.gridController = new GridController(this.grid);

        this.setEvents(); 
        this.start();  
    }

    protected setEvents() {
        App.once(GameEvents.START_GAME.toString(), this.startGameplay, this);
        App.on(GameEvents.START_NEW_GAME.toString(), this.startNewGame, this);
        App.on(GameEvents.FAILED_GAME.toString(), this.showFailedPackshot, this);
        App.on(GameEvents.END_GAME.toString(), this.endGame, this);
        App.on(GridEvents.MERGE, this.onMerge, this);
    }

    protected onMerge() {
        if (this.counter.value < 5){
            this.counter.addValue();
        }
        if (this.counter.value === 5){
            App.emit(GameEvents.END_GAME.toString());    
        }
    }

    private async start() {
        this.progressBar.node.alpha = 0;
        this.counter.node.alpha = 0;
        this.grid.cells.forEach(cell => cell.node.scale.set(0));
        await this.grid.tweens.wait(250);
        await this.grid.cells.forEach(cell => cell.animateCell());
        await this.grid.tweens.wait(450);
        await this.grid.darkGridTutorial();
        this.startPopup.show();
        this.startPopup.animate();
        this.grid.showGridFinger();

    }

    private async startGameplay() {
        this.grid.hideGridFinger();
        this.grid.lightGrid();
        this.bg.lightBg();
        this.startPopup.hideAnimation();
        this.failPopup.hideAnimation();
        this.grid.unlock();
        this.counter.tweens.fadeIn(200);
        this.progressBar.tweens.fadeIn(200);  
        await this.grid.tweens.wait(500);    
        this.progressBar.start();
    }

    private darkScene(){
        this.grid.darkGrid();
        this.progressBar.darkProgressBar();
        this.bg.darkBg();
        this.counter.darkCounter();
    }

    private showFailedPackshot() {
        this.failPopup.show();
        this.failPopup.showAnimatiom();
        this.grid.lock();
        this.darkScene();
    }

    private async startNewGame() {
        this.grid.createGrid();
        this.progressBar.reset();
        this.startGameplay();
        this.grid.cells.forEach(cell => cell.resetCell());
        this.counter.value = 0;
    }

    private endGame() {
        this.progressBar.stop();
        this.winPopup.show();
        this.winPopup.showAnimatiom();
        this.grid.lock();
        this.darkScene();
    }
}