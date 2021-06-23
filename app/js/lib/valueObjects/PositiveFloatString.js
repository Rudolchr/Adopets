import { PositiveNumber } from './PositiveNumber.js';
import { ValueObject } from './ValueObject.js';
export class PositiveFloatString extends ValueObject {
    constructor(value) {
        super(value);
    }
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
    static validate(value, errorPrefix) {
        return PositiveNumber.validate(this.validateString(value, errorPrefix), errorPrefix);
    }
    static validateWithInterval(value, min, max, errorPrefix) {
        return PositiveNumber.validateWithInterval(this.validateString(value, errorPrefix), min, max, errorPrefix);
    }
    static create(value, options) {
        if (options && options.min !== undefined && options.max !== undefined) {
            return new PositiveFloatString(this.validateWithInterval(value, options.min, options.max, this.pm(options.name)));
        }
        else {
            return new PositiveFloatString(this.validate(value, this.pm(options?.name)));
        }
    }
    static fromList(values, options) {
        return values.map((val) => this.create(val, options));
    }
    static toList(values) {
        return values.map((nes) => nes.value);
    }
    static parse(value) {
        return parseFloat(value.replace(',', '.'));
    }
}
//# sourceMappingURL=PositiveFloatString.js.map