import * as PIXI from "pixi.js";
import { Base } from "../base.js";

/**
 * Panel display shows the result of the spin
 * @class
 */
export class Panel extends Base {
    constructor(){
        super();
        this._create();
    }

    /**
     * Create the panel display using PIXI container
     * @private
     */
    _create(){
        this._native = new PIXI.Container("panelDisplay");
        this._native.x = 0;
        this._native.y = 0;

        //Positioning panel to be above button
        this._backgroundSprite = PIXI.Sprite.from("greenPanel");
        this._backgroundSprite.x = -26;
        this._backgroundSprite.y = 24;

        this._announcementText = new PIXI.Text(String(``),{
            fontFamily:  `Impact`,
            fontVariant: `small-caps`, 
            fontSize:    24, 
            fill:        0x151515, 
            align:       `center`
        });
        
        this.updateText(``);
        this.native.addChild(this._backgroundSprite,this._announcementText);
    }

    //Need to re-center text on any text update
    updateText(text){
        this._announcementText.text = text;
        this._announcementText.pivot.x = this._announcementText.width / 2;
        this._announcementText.pivot.y = this._announcementText.height / 2;
        this._announcementText.x = this._backgroundSprite.x + this._backgroundSprite.width / 2;
        this._announcementText.y = this._backgroundSprite.y + 16;
    }
}