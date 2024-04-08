import * as PIXI from "pixi.js";
import { Base } from "../base.js";

/**
 * Cloud
 * @class
 * @extends Base
 */
export class Cloud extends Base {

    /**
     * @param {number}  id      - id used for the cloud
     * @param {string}  image   - the cloud asset
     * @param {number}  cloudX  - the x value that will be added to the cloud
     * @param {number}  cloudY  - the y value that will be added to cloud
     * @param {number}  speed   - the speed the cloud will move across the screen
     * @param {number}  scale   - the scale the cloud will be set to on screen  
     */
    constructor(id, image, cloudX, cloudY, speed, scale){
        super();
        this._create(id, image, cloudX, cloudY, speed, scale);
    }

    /**
     * Get the id of the cloud
     * @readonly
     */
    get id(){
        return this._id;
    }

    /**
     * Create the cloud
     * @param {number}  id      - id used for the cloud
     * @param {string}  image   - the cloud asset
     * @param {number}  cloudX  - x value to place cloud at
     * @param {number}  cloudY  - y value to place cloud at
     * @param {number}  speed   - distance to move clouds per update
     * @param {number}  scale   - scale of the cloud, to give depth
     * @private
     */
    _create(id, image, cloudX, cloudY, speed, scale){
        this._id = id;
        this._image = image;
        this._cloudX = cloudX;
        this._cloudY = cloudY;
        this._speed = speed;
        this._scale = scale;

        this._moving = false;

        this._native = PIXI.Sprite.from(image)
        
        this.x = this.x + this._cloudX;
        this.y = this.y + this._cloudY;

        this._native.pivot.x = this._native.width/2;
        this._native.pivot.y = this._native.height/2;

        this._native.scale.set(this._scale, this._scale);
    }

    /**
     * Update called each frame
     * @private
     */
    async _update(){
        if(!this._moving){
            return;
        }

        this.x += (this._speed * this._scale);
        
        //Wrap clouds to other side of screen
        //Based off 1920x1020 screen size
        //Would need to do a mask
        let bleed = 100;
        if(this.x > 1024 + bleed + this._native.width/2){
            this.x = 0 - bleed - this._native.width/2;
        }
    }

    /**
     * set the moving parameter on the cloud
     * @member
     */
    get moving(){
        return this._moving;
    }

    set moving(moving){
        this._moving = moving;
    }
}