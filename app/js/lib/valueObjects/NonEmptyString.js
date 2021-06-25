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
            if (options.stringEnum && !Object.values(options.stringEnum).includes(value)) {
                throw new TypeError(this.pm(options.name) +
                    `NonEmptyString => the given value (${value}: ${typeof value}) is not in the stringEnum ${JSON.stringify(options?.stringEnum)}`);
            }
            // interval
            if ((options.min && value.length < options.min) || (options.max && value.length > options.max)) {
                throw new RangeError(this.pm(options.name) +
                    `NonEmptyString => the given string's length (${value}) must be in the interval [${options.min ?? 1}, ${options.max ?? Number.MAX_VALUE}]!`);
            }
        }
        return value;
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