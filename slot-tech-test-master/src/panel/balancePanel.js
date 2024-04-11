import { Panel } from "./panel.js";

/**
 * Balance panel to display the current balance
 * @class
 */
export class BalancePanel extends Panel{
    constructor(){
        super();
        this._balance = 500;
        //Fire update to show initial balance of 500
        this.updateBalance(0);
    }

    //Basic addition or subtraction can be sent through this function
    //Error checking could be done to stay above negative
    updateBalance(val){
        this._balance += val;
        this.updateText(`£${this._balance}`);
    }
}