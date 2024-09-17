import { Application } from "./scripts/Core/Application";
import { MraidPlatform } from "./scripts/MraidPlatform";
import './styles/fonts.css';

declare const mraid: any;

export const App = new Application();

export class SuperApp {

    protected platform: MraidPlatform;
    protected mode: string;

    constructor() {
        this.platform = new MraidPlatform({});
        this.mode = window['MODE'];
        this.init();
    }

    protected async init() {
        if (this.mode === 'MRAID') {
            console.log("MRAID", mraid);
            await this.platform.init();
            App.init();
        } 
        if (this.mode === 'DEV') {
            console.log("DEV");
            App.init();
        } 
        
    }
}

new SuperApp();
