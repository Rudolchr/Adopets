import { IntervalCreationOptions, ValueObject } from './ValueObject.js';

export class PositiveNumber extends ValueObject<number> {
    protected constructor(value: number) {
        super(value);
    }

    /** @throws {TypeError} */
    public static validate(value: number, errorPrefix: string) {
        if (typeof value !== 'number' || value < 0) {
            throw new TypeError(
                errorPrefix + `PositiveNumber => the given value (${value}: ${typeof value}) has to be a number >= 0!`
            );
        }

        return value;
    }

    /** @throws {RangeError} */
    public static validateWithInterval(value: number, min: number, max: number, errorPrefix: string) {
        this.validate(value, errorPrefix);
        if (value < min || value > max) {
            throw new RangeError(
                errorPrefix + `PositiveNumber => the given value (${value}) must be in the interval [${min}, ${max}]!`
            );
        }

        return value;
    }

    public static create(value: number, options?: IntervalCreationOptions) {
        if (options && options.min !== undefined && options.max !== undefined) {
            return new PositiveNumber(
                this.validateWithInterval(value, options.min, options.max, this.pm(options.name))
            );
        } else {
            return new PositiveNumber(this.validate(value, this.pm(options?.name)));
        }
    }

    public static fromList(values: number[], options?: IntervalCreationOptions) {
        return values.map((val) => this.create(val, options));
    }

    public static toList(values: PositiveNumber[]) {
        return values.map((pi) => pi.value);
    }
}
