import * as PIXI from "pixi.js";
import { Reel } from "./reel.js";
import { Base } from "../base.js";
import { timerManager } from "../utils/timermanager.js";
import { States } from "../states.js";
import { Core } from "../core.js";

/**
 * Reel manager controls multipler reels to start / stop spinning
 * After spinning the reels will be checked to find win conditions
 * @class
 */
export class ReelManager extends Base {
    /**
     * @param {number}  numberOfReels   - Number of reel instances to create
     * @param {number}  symbolsPerReel  - Number of reels in view for each reel created
     * @param {number}  reelWidth       - Width of each reel to position created reels correctly
     * @param {number}  symbolHeight    - Height of each symbol
     */
    constructor(core, numberOfReels, symbolsPerReel, reelWidth, symbolHeight) {
        super();
        this._core = core;
        this._numberOfReels = numberOfReels;
        this._symbolsPerReel = symbolsPerReel;
        this._reelWidth = reelWidth;
        this._symbolHeight = symbolHeight;
        this._reels = [];
        this._create();
    }

    /**
     * Create the reelManager using PIXI container and required reel instances
     * @private
     */
    _create() {
        this._native = new PIXI.Container("reelManager");
        this._native.x = 314;
        // this._native.y = 80;
        this._native.y = 156;
        this._createMask();
        this._createReels();
    }

    /**
     * Create reel mask to hide padding (out of view) symbols
     * @private
     */
    _createMask() {
        this._mask = PIXI.Sprite.from("mask");
        this._mask.y = -46;
        this._mask.scale.x = 2.3;
        this._mask.scale.y = 2.7;
        this._native.addChild(this._mask);
        this._native.mask = this._mask;
    }

    /**
     * Create reels
     * @private
     */
    _createReels() {
        for(let i = 0; i < this._numberOfReels; i++ ) {
            const reel = new Reel(this._symbolsPerReel, this._symbolHeight);
            reel.x = i * this._reelWidth;
            this._native.addChild(reel.native);
            this._reels.push(reel);
        }
    }

    /**
     * Start the reels spinning called when button is clicked
     */
    startSpin() {
        if (this._spinning) {
            return;
        }
        this._spinning = true;
        this._reels.forEach(reel => {
            reel.startSpin();
        });
    }

    /**
     * Stop the reels spinning sequentially
     * @async
     */
    async stopSpin() {
        if (!this._spinning) {
            return;
        }
        this._promises = [];
        this._promises.push(this._reels[0].stopSpin());
        await timerManager.startTimer(250);
        this._promises.push(this._reels[1].stopSpin());
        await timerManager.startTimer(250);
        this._promises.push(this._reels[2].stopSpin());
        
        await Promise.all(this._promises);
        
        await this._checkReels();

        this._spinning = false;
        //Allows button to activate the spin again
        this._core.currentState = States.STOPPED;
    }

    /**
     * Check the reel symbols after they have stopped spinning
     * Any winning symbols will be animated
     * symbolsByName returns 3 symbol._name instead of the total 5 symbol objects
     * @private
     */
    async _checkReels() {
        const reelSymbols = [];
        this._reels.forEach(function(reel){
            reelSymbols.push(reel.symbolsByName)
        });

        //Get the symbols that can match from the first reel as a set
        const symbolsSet = new Set([...reelSymbols[0]]);

        //symbolMap map will be used to store any grouping of symbols that occur as symbol: [indexes]
        //These will then be used to on the relevent reel symbols
        const symbolMap = new Map();
        symbolsSet.forEach(function(symbol){
            const index = reelSymbols[0].indexOf(symbol);
            symbolMap.set(symbol, [index]);
        });

        //Iterate through next two arrays
        for(let i = 1; i < reelSymbols.length; i++){
            const aReel = reelSymbols[i];

            symbolsSet.forEach(function(symbol){
                if(!aReel.includes(symbol)){
                    symbolsSet.delete(symbol);
                }
                else{
                    //Get the index of the first occurrence of symbol in the reel and push to the array
                    const index = aReel.indexOf(symbol);
                    symbolMap.get(symbol).push(index);
                }
            });
        }

        //Remove any symbols that are not in all 3 reels
        for (const [key, value] of symbolMap.entries()) {
            if(value.length < 3) 
                symbolMap.delete(key);
        }

        //Show winning symbols
        for (const [key, value] of symbolMap.entries()) {
            console.log(`winner`);
            //Pass the index of each winning sprite
            //+1 is used because the reel array has 5 symbols total
            //the 2 extra are at the start and end of the array
            let i = 0;
            for(const ind of value){
                this._reels[i].showWinners(ind+1);
                i++;
                await timerManager.startTimer(1000);
            }
        }

        await timerManager.startTimer(1000);

        //Stop winning symbols
        for (const [key, value] of symbolMap.entries()) {
            let i = 0;
            for(const ind of value){
                this._reels[i].stopWinners(ind+1);
                i++;
            }
        }
    }

}