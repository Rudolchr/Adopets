import { PossibleEmptyString } from './PossibleEmptyString.js';
export class NonEmptyString extends PossibleEmptyString {
    constructor(value) {
        super(value);
    }
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
    static validateWithInterval(value, min, max, errorPrefix, stringEnum) {
        this.validate(value, errorPrefix, stringEnum);
        if (value.length < min || value.length > max) {
            throw new RangeError(errorPrefix +
                `NonEmptyString => the given string's length (${value}) must be in the interval [${min}, ${max}]!`);
        }
        return value;
    }
    static create(value, options) {
        if (options?.min !== undefined && options?.max !== undefined) {
            return new NonEmptyString(this.validateWithInterval(value, options.min, options.max, this.pm(options.name)));
        }
        else {
            return new NonEmptyString(this.validate(value, this.pm(options?.name)));
        }
    }
    static fromList(values, options) {
        return values.map((val) => this.create(val, options));
    }
    static toList(values) {
        return values.map((nes) => nes.value);
    }
}
//# sourceMappingURL=NonEmptyString.js.map