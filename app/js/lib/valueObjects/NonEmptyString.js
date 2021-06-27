import { ValueObject } from './ValueObject.js';
/** a String that is definitely a String that is not empty */
export class NonEmptyString extends ValueObject {
    constructor(value) {
        super(value);
    }
    /**
     * @param value to be validated
     * @returns the value if the validation was successful
     * @throws {@link TypeError} if not a string or empty
     * @throws {@link TypeError} if doesn't fit the given enum
     * @throws {@link RangeError} if the value is not matching the regex
     * @throws {@link RangeError} if the value is not inside the interval
     */
    static validate(value, options) {
        // type
        if (!value || typeof value !== 'string' || value === '') {
            throw new TypeError(this.pm(options?.name) +
                `NonEmptyString => the given value (${value}: ${typeof value}) has to be a string with length > 0!`);
        }
        if (options) {
            // enum
            NonEmptyString.validateRange(value, options);
            // interval
            if ((options.min && value.length < options.min) || (options.max && value.length > options.max)) {
                throw new RangeError(this.pm(options.name) +
                    `NonEmptyString => the given string's length (${value}) must be in the interval [${options.min ?? 1}, ${options.max ?? Number.MAX_VALUE}]!`);
            }
            // regex
            if (options.regex && !options.regex.test(value)) {
                throw new RangeError(this.pm(options.name) +
                    `NonEmptyString => the given value (${value}: ${typeof value}) does not match the RFC 5322 standard!`);
            }
        }
        return value;
    }
    static validateRange(value, options) {
        if (options.range) {
            if (Array.isArray(options.range) && !options.range.includes(value)
                || typeof options.range === 'object' && !Object.values(options.range).includes(value)) {
                throw new TypeError(this.pm(options.name) +
                    `NonEmptyString => the given value (${value}: ${typeof value}) is not in the range ${JSON.stringify(options?.range)}`);
            }
        }
    }
    /**
     * @param value to create the ValueObject of
     * @param options for the creation
     * @returns the created ValueObject
     */
    static create(value, options) {
        return new NonEmptyString(this.validate(value, options));
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
}
//# sourceMappingURL=NonEmptyString.js.map