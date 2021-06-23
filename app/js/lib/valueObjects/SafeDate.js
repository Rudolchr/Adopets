import { ValueObject } from './ValueObject.js';
export class SafeDate extends ValueObject {
    constructor(value) {
        super(value);
    }
    static validate(value, errorPrefix) {
        if (typeof value === 'string' || typeof value === 'number') {
            if (typeof value === 'string' ? isNaN(Date.parse(value)) : isNaN(value)) {
                throw new TypeError(errorPrefix + `SafeDate => the given (${value}: ${typeof value}) is not parseable!`);
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
    static create(value, options) {
        if (options && options.min !== undefined && options.max !== undefined) {
            return new SafeDate(this.validateWithInterval(value, options.min, options.max, this.pm(options.name)));
        }
        else {
            return new SafeDate(this.validate(value, this.pm(options?.name)));
        }
    }
    static fromList(values, options) {
        return values.map((val) => this.create(val, options));
    }
    static toList(values) {
        return values.map((pi) => pi.value);
    }
    toJSON() {
        return this._value.toJSON();
    }
}
//# sourceMappingURL=SafeDate.js.map