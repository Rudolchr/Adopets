import { PossibleEmptyString } from './PossibleEmptyString.js';
/** a String that is definitely a String that is not empty */
export class NonEmptyString extends PossibleEmptyString {
    constructor(value) {
        super(value);
    }
    /**
     * @param value to be validated
     * @param errorPrefix to show on error messages
     * @param stringEnum an enum the value has to be in
     * @returns the value if the validation was successful
     * @throws {@link TypeError} if not a string or empty
     */
    static validate(value, errorPrefix, stringEnum) {
        if (typeof value !== 'string' || value === '') {
            throw new TypeError(errorPrefix +
                `NonEmptyString => the given value (${value}: ${typeof value}) has to be a string with length > 0!`);
        }
        if (stringEnum && !Object.values(stringEnum).includes(value)) {
            throw new TypeError(errorPrefix +
                `NonEmptyString => the given value (${value}: ${typeof value}) is not in the stringEnum ${JSON.stringify(stringEnum)}`);
        }
        return value;
    }
    /**
     * @param value to be validated
     * @param min the lower (inclusive) bound the value must take
     * @param max the upper (inclusive) bound the value must take
     * @param errorPrefix to show on error messages
     * @param stringEnum an enum the value has to be in
     * @returns the value if the validation was successful
     * @throws {@link TypeError} if not a string or empty
     * @throws {@link RangeError} if the value is not inside the interval
     */
    static validateWithInterval(value, min, max, errorPrefix, stringEnum) {
        this.validate(value, errorPrefix, stringEnum);
        if (value.length < min || value.length > max) {
            throw new RangeError(errorPrefix +
                `NonEmptyString => the given string's length (${value}) must be in the interval [${min}, ${max}]!`);
        }
        return value;
    }
    /**
     * @param value to create a NonEmptyString of
     * @param options for the creation
     * @returns the created ValueObject
     */
    static create(value, options) {
        if (options?.min !== undefined && options?.max !== undefined) {
            return new NonEmptyString(this.validateWithInterval(value, options.min, options.max, this.pm(options.name)));
        }
        else {
            return new NonEmptyString(this.validate(value, this.pm(options?.name)));
        }
    }
    /**
     * @param values an array of strings to create an array of NonEmptyStrings from
     * @param options for the **individual** creation
     * @returns the array of ValueObjects
     */
    static fromList(values, options) {
        return values.map((val) => this.create(val, options));
    }
    /**
     * @param values an array of NonEmptyStrings to convert to an array of strings
     * @returns the array of strings
     */
    static toList(values) {
        return values.map((nes) => nes.value);
    }
}
//# sourceMappingURL=NonEmptyString.js.map