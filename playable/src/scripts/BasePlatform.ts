import * as PIXI from 'pixi.js';

export class BasePlatform extends PIXI.utils.EventEmitter {
    protected _key;
    protected _config;

    constructor(key: string = "default", config: any) {
        super();
        this._key = key;
        this._config = config;
        window["lp_url"] = this._url;
    }

    public init(): Promise<void> {
        return new Promise(resolve => {
            this.once("ready", () => resolve());
            this._onReady();
        });
    }

    public redirect(): void {
        console.log(this._url);
        return Function(`window["location"].href="${this._url}"`)();
    }

    public get code(): string {
        return this._key;
    }

    protected _onReady() {
        this.emit('ready');
    }

    protected get _url(): string {
        return '';
    }
}
