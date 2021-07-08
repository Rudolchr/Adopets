import { PositiveNumber } from './PositiveNumber.js';
import { ValueObject } from './ValueObject.js';
/** an integer that is greater than 0 an can be created from a (valid) string as well as a number */
export class PositiveIntegerString extends ValueObject {
    constructor(value) {
        super(value);
    }
    /**
     * @param value to be validated
     * @returns the value if the validation was successful
     * @throws {@link TypeError} if not a positive number
     * @throws {@link RangeError} if the value is not inside the interval
     */
    static validate(value, options) {
        let transformed;
        // string
        if (typeof value !== 'number') {
            if (isNaN(parseInt(value, 10))) {
                throw new TypeError(this.pm(options?.name) +
                    `PositiveIntegerString => the given value (${value}: ${typeof value}) has to be a number or a string representing a number!`);
            }
            transformed = parseInt(value, 10);
        }
        else {
            transformed = value;
        }
        // type + interval
        return PositiveNumber.validate(transformed, options);
    }
    /**
     * @param value to create a PositiveIntegerString from
     * @param options for the creation
     * @returns the created ValueObject
     */
    static create(value, options) {
        return new PositiveIntegerString(this.validate(value, options));
    }
    /**
     * @param values an array of strings to map to an array of ValueObjects
     * @param options for the **individual** creation
     * @returns the array of ValueObjects
     */
    static fromList(values, options) {
        return values.map((val) => this.create(val, options));
    }
    /**
     * @param values an array of ValueObjects to map to an array of their values
     * @returns the array of values
     */
    static toList(values) {
        return values.map((nes) => nes.value);
    }
    equals(obj) {
        return (obj instanceof PositiveIntegerString ? obj.value : obj) === this._value;
    }
}
//# sourceMappingURL=PositiveIntegerString.js.map