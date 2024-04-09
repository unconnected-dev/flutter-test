import * as PIXI from "pixi.js";
import { Base } from "../base.js";
import { Cloud } from "./cloud.js";
import { renderer } from "../renderer.js";

/**
 * Cloud manager controls multiple clouds
 * @class
 */

export class CloudManager extends Base{
    /**
     * @param {number}  numberOfClouds  - number of clouds to create
     * @param {number}  minX            - minimum x value for clouds to be placed at
     * @param {number}  maxX            - maximum x value for the clouds to be placed at
     * @param {number}  minY            - minimum y value for clouds to be placed at
     * @param {number}  maxY            - maximum y value for clouds to be placed at
     * @param {number}  minSpeed        - minimum speed for clouds to move
     * @param {number}  maxSpeed        - maximum speed for clouds to move
     * @param {number}  minScale        - minimum scaling for clouds
     * @param {number}  maxScale        - maximum scaling for clouds
     */
    constructor(numberOfClouds, minX, maxX, minY, maxY, minSpeed, maxSpeed, minScale, maxScale){
        super();
        this._numberOfClouds = numberOfClouds;
        this._minX = minX;
        this._maxX = maxX;
        this._minY = minY;
        this._maxY = maxY;
        this._minSpeed = minSpeed;
        this._maxSpeed = maxSpeed;
        this._minScale = minScale;
        this._maxScale = maxScale;
        this._clouds = [];
        this._create();
        this._createMask();
    }

    /**
     * create mask to hide clouds outside of the background
     * @private
     */
    _createMask(){
        this._mask = PIXI.Sprite.from("backgroundMask");
        this._native.addChild(this._mask);
        this._native.mask = this._mask;
    }

    /**
     * Create the cloudManager using PIXI container and required cloud instances
     * @private
     */
    _create(){
        this._native = new PIXI.Container("cloudManager");

        this._native.x = 0;
        this._native.y = 0;

        for(let i = 0; i < this._numberOfClouds; i++){
            const image = this._getRandomCloud();
            const cloudX = this._getRandomCloudX();
            const cloudY = this._getRandomCloudY();
            const speed = this._getRandomCloudSpeed();
            const scale = this._getRandomCloudScale();
            const aCloud = new Cloud(i, image, cloudX, cloudY, speed, scale);

            this._native.addChild(aCloud._native);
            this._clouds.push(aCloud);

            //Add to ticker for animation
            renderer.app.ticker.add(() => {
                aCloud._update(renderer.app.ticker.elapsedMS);
            });
        }

        this._enableCloudsMovement(true);
    }

    /**
     * Activate clouds (get them moving)
     * @param {boolean} [active=true]
     */
    _enableCloudsMovement(active = true){
        for(let i = 0; i < this._clouds.length; i++){
            this._clouds[i].moving = active;
        }
    }

    /**
     * get random cloud image
     * @private
    */
    _getRandomCloud(){
       const arr = ["cloud1", "cloud2"];
       const randomIndex = Math.floor(Math.random() * arr.length);
       return arr[randomIndex];
    }
 
    /**
     * get random x value
     * @private
     */
    _getRandomCloudX(){
        return this._getRandomInt(this._minX, this._maxX);
    }

    /**
     * get random y value
     * @private
     */
    _getRandomCloudY(){
        return this._getRandomInt(this._minY, this._maxY);
    }
    
    /**
     * get random cloud speed
     * @private
     */
   _getRandomCloudSpeed(){
       return this._getRandomInt(this._minSpeed, this._maxSpeed); 
    }
    
    /**
     * get random cloud scale
     * whatever whole integer is returned it is divided by 10 to keep at an appropriate scale (7 becomes 0.7)
     * @private
     */
    _getRandomCloudScale(){
        return this._getRandomInt(this._minScale, this._maxScale) / 10;
    }

    /**
     * get random integer from between and min and max
     * @private
     */
    _getRandomInt(iMin, iMax){
        return Math.floor(Math.random() * iMax) + iMin;
    }
}