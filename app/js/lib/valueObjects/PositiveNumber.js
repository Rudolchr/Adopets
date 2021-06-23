import { ValueObject } from './ValueObject.js';
export class PositiveNumber extends ValueObject {
    constructor(value) {
        super(value);
    }
    static validate(value, errorPrefix) {
        if (typeof value !== 'number' || value < 0) {
            throw new TypeError(errorPrefix + `PositiveNumber => the given value (${value}: ${typeof value}) has to be a number >= 0!`);
        }
        return value;
    }
    static validateWithInterval(value, min, max, errorPrefix) {
        this.validate(value, errorPrefix);
        if (value < min || value > max) {
            throw new RangeError(errorPrefix + `PositiveNumber => the given value (${value}) must be in the interval [${min}, ${max}]!`);
        }
        return value;
    }
    static create(value, options) {
        if (options && options.min !== undefined && options.max !== undefined) {
            return new PositiveNumber(this.validateWithInterval(value, options.min, options.max, this.pm(options.name)));
        }
        else {
            return new PositiveNumber(this.validate(value, this.pm(options?.name)));
        }
    }
    static fromList(values, options) {
        return values.map((val) => this.create(val, options));
    }
    static toList(values) {
        return values.map((pi) => pi.value);
    }
}
//# sourceMappingURL=PositiveNumber.js.map