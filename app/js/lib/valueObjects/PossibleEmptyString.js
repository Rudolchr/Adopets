import { ValueObject } from './ValueObject.js';
export class PossibleEmptyString extends ValueObject {
    constructor(value) {
        super(value);
    }
    static validate(value, errorPrefix) {
        if (typeof value !== 'string') {
            throw new TypeError(errorPrefix + `String => the given value (${value}: ${typeof value}) has to be a string!`);
        }
        return value;
    }
    static validateWithInterval(value, min, max, errorPrefix) {
        this.validate(value, errorPrefix);
        if (value.length > 0 && (value.length < min || value.length > max)) {
            throw new RangeError(errorPrefix +
                `String => the given string's length (${value}) must be in the interval [${min}, ${max}] or empty!`);
        }
        return value;
    }
    static create(value, options) {
        if (options?.min !== undefined && options?.max !== undefined) {
            return new PossibleEmptyString(this.validateWithInterval(value ?? '', options.min, options.max, this.pm(options.name)));
        }
        else {
            return new PossibleEmptyString(this.validate(value ?? '', this.pm(options?.name)));
        }
    }
    static fromList(values, options) {
        return values.map((val) => this.create(val, options));
    }
    static toList(values) {
        return values.map((pes) => pes.value);
    }
}
//# sourceMappingURL=PossibleEmptyString.js.map