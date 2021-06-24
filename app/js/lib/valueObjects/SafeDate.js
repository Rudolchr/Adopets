import { ValueObject } from './ValueObject.js';
/** a Date that is definitely a Date that can be created from either a Date or a string that
 * represents a Date or a number that represents the Time in ms */
export class SafeDate extends ValueObject {
    constructor(value) {
        super(value);
    }
    /**
     * @param value to be validated
     * @param errorPrefix to show on error messages
     * @returns the value if the validation was successful
     * @throws {@link TypeError} if not parsable to a valid Date
     */
    static validate(value, errorPrefix) {
        if (typeof value === 'string' || typeof value === 'number') {
            if (typeof value === 'string' ? isNaN(Date.parse(value)) : isNaN(value)) {
                throw new TypeError(errorPrefix + `SafeDate => the given (${value}: ${typeof value}) is not parsable!`);
            }
            else {
                return new Date(value);
            }
        }
        else if (!(value instanceof Date)) {
            throw new TypeError(errorPrefix +
                `SafeDate => the given (${value}: ${typeof value}) is whether a Date nor a string | number!`);
        }
        else {
            return value;
        }
    }
    /**
     * @param value to be validated
     * @param min the (inclusive) minimum Date the value can be
     * @param max the (inclusive) maximum Date the value can be
     * @param errorPrefix to show on error messages
     * @returns the value if the validation was successful
     * @throws {@link TypeError} if any of the Dates is not parsable
     * @throws {@link RangeError} if the value is not inside the interval
     */
    static validateWithInterval(value, min, max, errorPrefix) {
        const safeValue = this.validate(value, errorPrefix);
        const safeMin = this.validate(min, errorPrefix + '.min');
        const safeMax = this.validate(max, errorPrefix + '.max');
        if (safeValue.getTime() < safeMin.getTime() || safeValue.getTime() > safeMax.getTime()) {
            throw new RangeError(errorPrefix +
                `SafeDate => the given Date (${safeValue}) must be in the interval [${safeMin}, ${safeMax}]!`);
        }
        return safeValue;
    }
    /**
     * @param value to create a SafeDate of
     * @param options for the creation
     * @returns the created ValueObject
     */
    static create(value, options) {
        if (options && options.min !== undefined && options.max !== undefined) {
            return new SafeDate(this.validateWithInterval(value, options.min, options.max, this.pm(options.name)));
        }
        else {
            return new SafeDate(this.validate(value, this.pm(options?.name)));
        }
    }
    /**
     * @param values an array of parsable Dates to create an array of SafeDates from
     * @param options for the **individual** creation
     * @returns the array of ValueObjects
     */
    static fromList(values, options) {
        return values.map((val) => this.create(val, options));
    }
    /**
     * @param values an array of SafeDates to convert to an array of Dates
     * @returns the array of strings
     */
    static toList(values) {
        return values.map((pi) => pi.value);
    }
    /* @ts-ignore */
    toJSON() {
        // TODO it works but check why this can't be the super.toJSON()
        return this._value.toJSON();
    }
}
//# sourceMappingURL=SafeDate.js.map