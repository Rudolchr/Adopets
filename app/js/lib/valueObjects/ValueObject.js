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
        return n ? n + "->" : "";
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
/**
 * compares 2 Lists of ValueObjects / values on equality
 * @param a the list of ValueObjects to compare with
 * @param b a list of ValueObjects / values for comparison
 * @returns
 */
export function listEquals(a, b) {
    // lengths
    if (a.length === 0 && b.length === 0) {
        return true;
    }
    if (a.length !== b.length) {
        return false;
    }
    // elements
    for (let i = 0; i < a.length; i++) {
        const ai = a[i];
        const bi = b[i];
        // types
        if (bi instanceof ValueObject &&
            ai.constructor.name !== bi.constructor.name) {
            return false;
        }
        if (!(bi instanceof ValueObject) && typeof ai.value !== typeof bi) {
            return false;
        }
        if (!ai.equals(bi)) {
            return false;
        }
    }
    return true;
}
//# sourceMappingURL=ValueObject.js.map