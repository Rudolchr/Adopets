import { ValueObject } from './ValueObject.js';
/** a number that is definitely positive */
export class PositiveNumber extends ValueObject {
    constructor(value) {
        super(value);
    }
    /**
     * @param value to be validated
     * @param errorPrefix to show on error messages
     * @returns the parsed value if the validation was successful
     * @throws {@link TypeError} if not a positive number
     */
    static validate(value, errorPrefix) {
        if (typeof value !== 'number' || value < 0) {
            throw new TypeError(errorPrefix + `PositiveNumber => the given value (${value}: ${typeof value}) has to be a number >= 0!`);
        }
        return value;
    }
    /**
     * @param value to be validated
     * @param min the lower (inclusive) bound the value must take
     * @param max the upper (inclusive) bound the value must take
     * @param errorPrefix to show on error messages
     * @returns the value if the validation was successful
     * @throws {@link TypeError} if not a positive number (representing string)
     * @throws {@link RangeError} if the value is not inside the interval
     */
    static validateWithInterval(value, min, max, errorPrefix) {
        this.validate(value, errorPrefix);
        if (value < min || value > max) {
            throw new RangeError(errorPrefix + `PositiveNumber => the given value (${value}) must be in the interval [${min}, ${max}]!`);
        }
        return value;
    }
    /**
     * @param value to create a PositiveNumber from
     * @param options for the creation
     * @returns the created ValueObject
     */
    static create(value, options) {
        if (options && options.min !== undefined && options.max !== undefined) {
            return new PositiveNumber(this.validateWithInterval(value, options.min, options.max, this.pm(options.name)));
        }
        else {
            return new PositiveNumber(this.validate(value, this.pm(options?.name)));
        }
    }
    /**
     * @param values an array of numbers to create an array of PositiveNumber of
     * @param options for the **individual** creation
     * @returns the array of ValueObjects
     */
    static fromList(values, options) {
        return values.map((val) => this.create(val, options));
    }
    /**
     * @param values an array of PositiveNumber to convert to an array of numbers
     * @returns the array of numbers
     */
    static toList(values) {
        return values.map((pi) => pi.value);
    }
}
//# sourceMappingURL=PositiveNumber.js.map