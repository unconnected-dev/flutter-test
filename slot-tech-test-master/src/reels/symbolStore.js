import { Symbol } from "./symbol.js";

/**
 * @typedef SymbolObject
 * @property {number} id - Id of the symbol
 * @property {string} name - name of the symbol
 */

/**
 * Symbol store used to create all symbols at initialisation for use through the game
 * @class
 */
class SymbolStore {
    constructor() {
        this._symbols = new Map();
    }

    /**
     * @param {Array.<SymbolObject>} symbolIds - Array of objects to create the symbols
     * @param {number} reels - number of reels
     * @param {number} rows - number of symbols in view
     */
    createSymbols(symbolIds, reels, rows) {
        const maxSymbols = reels * rows;

        for(let i = 0; i < symbolIds.length; i++) { 
            const {id, name} = symbolIds[i];       
            const symbols = [];
            for(let j = 0; j < maxSymbols; j++) {
                symbols.push(new Symbol(id, name))
            }
            
            this._symbols.set(id, symbols);
        }
    }

    /**
     * Reusing symbols object in core.js to generate a hashmap for finding the win values
     * @param {Array.<SymbolObject>} symbolIds - Array of objects to create the symbols
     */
    generateWinMap(symbolIds){
        this._winMap = new Map()
        for(let i = 0; i < symbolIds.length; i++){
            const {id, name, value} = symbolIds[i];  
            this._winMap.set(name, value);
        }
    }

    /**
     * get a random symbol from the store
     * @returns {Symbol}
     */
    getRandomSymbol() {
        const symbolId = Math.floor(Math.random() * this._symbols.size);
        return this.getSymbol(symbolId);
    }

    /**
     * get a specific symbol type based on id
     * @param {number} id - id of the symbol to retrieve
     * @returns {Symbol}
     */
    getSymbol(id) {
        if (this._symbols.has(id)) {
            let symbol = this._symbols.get(id).pop();
            return symbol;
        }
    }

    /**
     * return a used symbol to the store ready for reuse
     * @param {Symbol} symbol - symbol to return to the store
     */
    returnSymbol(symbol) {
        symbol.reset();
        this._symbols.get(symbol.id).push(symbol);
    }

    /**
     * Get the map to check for winning value
     * @readonly
     */
    get winMap(){
        return this._winMap;
    }
}

export const symbolStore = new SymbolStore();