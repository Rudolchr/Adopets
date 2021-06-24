import { PositiveNumber } from './PositiveNumber.js';
import { ValueObject } from './ValueObject.js';
/** a float that is greater than 0 an can be created from a (valid) string as well as a number */
export class PositiveFloatString extends ValueObject {
    constructor(value) {
        super(value);
    }
    /**
     * @param value to be validated
     * @param errorPrefix to show on error messages
     * @returns the parsed value if the validation was successful
     * @throws {@link TypeError} if not a parsable number
     */
    static validateString(value, errorPrefix) {
        if (typeof value !== 'number') {
            if (isNaN(this.parse(value))) {
                throw new TypeError(errorPrefix +
                    `PositiveFloatString => the given value (${value}: ${typeof value}) has to be a number or a string representing a number!`);
            }
            return this.parse(value);
        }
        else {
            return value;
        }
    }
    /**
     * @param value to be validated
     * @param errorPrefix to show on error messages
     * @returns the parsed value if the validation was successful
     * @throws {@link TypeError} if not a positive number (representing string)
     */
    static validate(value, errorPrefix) {
        return PositiveNumber.validate(this.validateString(value, errorPrefix), errorPrefix);
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
        return PositiveNumber.validateWithInterval(this.validateString(value, errorPrefix), min, max, errorPrefix);
    }
    /**
     * @param value to create a PositiveFloatString from
     * @param options for the creation
     * @returns the created ValueObject
     */
    static create(value, options) {
        if (options && options.min !== undefined && options.max !== undefined) {
            return new PositiveFloatString(this.validateWithInterval(value, options.min, options.max, this.pm(options.name)));
        }
        else {
            return new PositiveFloatString(this.validate(value, this.pm(options?.name)));
        }
    }
    /**
     * @param values an array of numbers / strings to create an array of PositiveFloatString from
     * @param options for the **individual** creation
     * @returns the array of ValueObjects
     */
    static fromList(values, options) {
        return values.map((val) => this.create(val, options));
    }
    /**
     * @param values an array of PositiveFloatString to convert to an array of numbers
     * @returns the array of numbers
     */
    static toList(values) {
        return values.map((nes) => nes.value);
    }
    /**
     * parses the given string to a (float) number where a possible `,` will be correctly replaced by a `.`.
     * @param value to parse (unchecked)
     * @returns the parsed number **OR** `NaN` if not parsable
     */
    static parse(value) {
        return parseFloat(value.replace(',', '.'));
    }
}
//# sourceMappingURL=PositiveFloatString.js.map