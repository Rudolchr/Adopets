import { ValueObject } from './ValueObject.js';
/** a String that can (by creation) be either `"" | undefined` as well as a conventional string */
export class PossibleEmptyString extends ValueObject {
    constructor(value) {
        super(value);
    }
    /**
     * @param value to be validated (defaults `''`)
     * @param errorPrefix to show on error messages
     * @param stringEnum an enum the value has to be in
     * @returns the value if the validation was successful
     * @throws {@link TypeError} if not a string
     */
    static validate(value, errorPrefix) {
        if (typeof value !== 'string') {
            throw new TypeError(errorPrefix + `String => the given value (${value}: ${typeof value}) has to be a string!`);
        }
        return value;
    }
    /**
     * @param value to be validated (defaults `''`)
     * @param min the lower (inclusive) bound the value must take (if not `undefined`)
     * @param max the upper (inclusive) bound the value must take (if not `undefined`)
     * @param errorPrefix to show on error messages
     * @returns the value if the validation was successful
     * @throws {@link TypeError} if not a string
     * @throws {@link RangeError} if the value is defined and not inside the interval
     */
    static validateWithInterval(value = '', min, max, errorPrefix) {
        this.validate(value, errorPrefix);
        if (value.length > 0 && (value.length < min || value.length > max)) {
            throw new RangeError(errorPrefix +
                `String => the given string's length (${value}) must be in the interval [${min}, ${max}] or empty!`);
        }
        return value;
    }
    /**
     * @param value to create a PossibleEmptyString of
     * @param options for the creation
     * @returns the created ValueObject
     */
    static create(value, options) {
        if (options?.min !== undefined && options?.max !== undefined) {
            return new PossibleEmptyString(this.validateWithInterval(value ?? '', options.min, options.max, this.pm(options.name)));
        }
        else {
            return new PossibleEmptyString(this.validate(value ?? '', this.pm(options?.name)));
        }
    }
    /**
     * @param values an array of strings to create an array of PossibleEmptyStrings form
     * @param options for the **individual** creation
     * @returns the array of ValueObjects
     */
    static fromList(values, options) {
        return values.map((val) => this.create(val, options));
    }
    /**
     * @param values an array of PossibleEmptyStrings to convert to an array of strings
     * @returns the array of strings
     */
    static toList(values) {
        return values.map((pes) => pes.value);
    }
}
//# sourceMappingURL=PossibleEmptyString.js.map