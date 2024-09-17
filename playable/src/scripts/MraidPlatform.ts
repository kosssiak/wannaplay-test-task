declare const mraid;

import { BasePlatform } from './BasePlatform';

export class MraidPlatform extends BasePlatform {           // Class for MRAID
    constructor(config, key = "mraid") {
        super(key, config);
    }

    public init(): Promise<void> {
        return new Promise(resolve => {
            this.once("ready", () => resolve());

            if (mraid.getState() === 'loading') {
                mraid.addEventListener('ready', this._onReady.bind(this));
            } else {
                this.emit('ready');
            }
        });
    }

    protected _onAudioVolumeChange(volume: number): void {
        let isAudioEnabled = !!volume;
        this.emit('soundEnabledChange', isAudioEnabled);
    }

    protected _onReady() {
        mraid.addEventListener('viewableChange', this._onViewableChange.bind(this));
        mraid.addEventListener('audioVolumeChange', this._onAudioVolumeChange.bind(this));

        if (mraid.isViewable()) {
            this._onViewable();
        }
    }

    protected _onViewable(): void {
        mraid.expand();
        this.emit('ready');
    }

    protected _onViewableChange(viewable: any): void {
        this.emit('soundEnabledChange', (viewable ? true : false));

        if (viewable) {
            this._onViewable();
        }
    }

}