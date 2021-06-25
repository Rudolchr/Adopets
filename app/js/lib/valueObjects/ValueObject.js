export class ValueObject {
    _value;
    constructor(value) {
        this._value = value;
    }
    /**
     * creates a pre-error string message that can be used to extend error messages, depending on
     * if the name of the ValueObject is given
     * @param n name of the ValueObject (where it takes place)
     * @returns the pre error string
     */
    static pm(n) {
        return n ? n + '->' : '';
    }
    /**
     * the actual value of this ValueObject
     */
    get value() {
        return this._value;
    }
    /**
     * this function is invoked by `JSON.stringify()` and converts the inner `"_propertyKey"` to `"propertyKey"`
     * "Gesamtkonto {NonEmptyString}"
     * @returns {{}} the value
     */
    toJSON() {
        return this._value;
    }
}
//# sourceMappingURL=ValueObject.js.map