import * as PIXI from "pixi.js";
import { symbolStore } from "./symbolStore.js";
import { Base } from "../base.js";
import { Easings, Tween } from "../utils/tween.js";
import { renderer } from "../renderer.js";

/**
 * Base reel class to handle a single reel spinning random symbols throuhg a reel apature
 * @class
 */
export class Reel extends Base {
    /**
     * @param {number}  numberOfSymbols - Number of symbols in view on the reel
     * @param {number}  symbolHeight    - Height of each symbol
     */
    constructor(numberOfSymbols, symbolHeight) {
        super();
        this._symbolsInView = numberOfSymbols;
        this._symbolHeight = symbolHeight;
        this._symbols = [];
        this._spinning = false;
        this._spinningSpeed = 0;
        this._create();
        //Using winningIndex means numbers 1-3 so we have 0 just undefined
        this._activeTween = [...Array(4)];
    }

    /**
     * Create the reel using PIXI container and initial symbols
     * @private
     */
    _create() {
        this._native = new PIXI.Container("reel");
        const totalHeight = this._symbolHeight * (this._symbolsInView);
        //+2 symbols for before and after to hide creation and removal of symbols
        for (let i = 0; i < this._symbolsInView + 2; i++) { 
            const symbol = symbolStore.getRandomSymbol();
            symbol.y = totalHeight - (i * this._symbolHeight);
            this._native.addChild(symbol.native);
            this._symbols.unshift(symbol);
        }
        renderer.app.ticker.add(() => {
            this._update(renderer.app.ticker.elapsedMS);
        });
    }

    /**
     * Start the reels spinning
     * @async
     */
    async startSpin() {
        if(this._spinning) {
            return;
        }
        this._spinning = true;
        this._createNextSymbol();
        
        Tween.fromTo(this, 1000, {_spinningSpeed: 0, ease: Easings.Back.easeIn}, {_spinningSpeed: 10}).startPromise();

    }

    /**
     * Start stopping the reel from spinning
     * @async
     */
    async stopSpin() {
        this._stopping = true;        
        return new Promise(resolve => {
            this._resolve = resolve;
        })
    }

    /**
     * Update called each frame
     * @async
     * @private 
     */
    async _update() {
        if(!this._spinning) {
            return;
        }
        this._symbols.forEach(symbol => {
            symbol.native.y += this._spinningSpeed;
        });

        if (this._symbols[0].native.y >= -this._symbolHeight ) {
            this._createNextSymbol();
            const symbol = this._symbols.pop();
            symbolStore.returnSymbol(symbol);
            if (this._stopping) {
                this._stopping = false;
                this._spinning = false;
                this._repositionSymbols();             
                this.stop();
            }
        }
    }
        
    /**
     * Tween reels to the final position and respone promise from stopSpin()
     * @async
     */
    async stop() {
        await Tween.fromTo(this._native, 750, {y: 0, ease: Easings.Back.easeOut}, {y: this._symbolHeight}).startPromise();
        this._native.y = 0;
        const symbol = this._symbols.pop();
        symbolStore.returnSymbol(symbol);
        this._repositionSymbols();
        this._resolve();
    }

    /**
     * Create the next symbol to spin through te appature either random or a specific id
     * @param {number} [symbolId=null] - Symbol id to generate
     * @private
     */
    _createNextSymbol(symbolId=null) {
        const symbol = symbolId === null ? symbolStore.getRandomSymbol() : symbolStore.getSymbol(symbolId);
        symbol.y = this._symbols[0].native.y-this._symbolHeight;
        this._native.addChild(symbol.native);
        this._symbols.unshift(symbol);
    }

    /**
     * Reset all symbols to the correct positions
     * @private
     */
    _repositionSymbols() {
        const paddingTop = this._symbols.length === this._symbolsInView + 2 ? 1 : 2;
        this._symbols.forEach((symbol, index) => symbol.y = (this._symbolHeight*index) - (this._symbolHeight*paddingTop));
    }

    /**
     * Show winning symbols tween
     * This will do a slow pulse
     * @param {number} winningIndex 
     */
    showWinners(winningIndex){
        this._activeTween[winningIndex] = Tween.fromTo(this._symbols[winningIndex].native.scale, 500, {x:0.5, y:0.5}, {x: 1, y: 1, repeat: -1, yoyo: true, ease: Easings.Elastic.ease});
        this._activeTween[winningIndex]; 
    }

    /**
     * Stop winning symbols tween
     * This will stop current pulse, scale up to 1.3, scale back to 1
     * @param {number} winningIndex 
     */
    stopWinners(winningIndex){
        this._activeTween[winningIndex].kill();
        
        let currentScaleX = this._symbols[winningIndex].native.scale.x;
        let currentScaleY = this._symbols[winningIndex].native.scale.y;

        Tween.fromTo(
            this._symbols[winningIndex].native.scale,
            500,
            { x: currentScaleX, y: currentScaleY },
            { x: 1.3, y: 1.3, ease: Easings.Elastic.ease, onComplete: () => {

                //Back to original scale
                Tween.fromTo(
                    this._symbols[winningIndex].native.scale,
                    250,
                    { x: 1.3, y: 1.3 },
                    { x: 1, y: 1, ease: Easings.Elastic.easeOut }
                );
            }}
        );
    }

    /**
     * Get symbols names
     */
    get symbolsByName(){
        return [this._symbols[1]._name, this._symbols[2]._name, this._symbols[3]._name];
    }
}