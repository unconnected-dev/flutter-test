/**
 * Base class to add getters and setters for classes that create PIXI object as this._native
 * @class
 */
export class Base {
    constructor() {
        this._native = null;
    }    

    /**
     * Set the x parameter on the native pixi object
     * @member
     */
    get x() {
        return this._native.x;
    }
    set x(x) {
        this._native.x = x;
    }
    
    /**
     * Set the y parameter on the native pixi object
     * @member
     */
    get y() {
        return this._native.y;
    }
    set y(y) {
        this._native.y = y;
    }

    /**
     * Get the scale x parameter on the native pixi object
     * @member
     * @readonly
     */
    get scaleX(){
        return this._native.scale._x;
    }
    
    /**
     * Get the scale y parameter on the native pixi object
     * @member
     * @readyonly
     */
    get scaleY(){
        return this._native.scale._y;
    }

    /**
     * Get the base pixi object
     * @member
     * @readonly
     */
    get native() {
        return this._native;
    }
}