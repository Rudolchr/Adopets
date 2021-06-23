import { PositiveNumber } from './PositiveNumber.js';
import { IntervalCreationOptions, ValueObject } from './ValueObject.js';

export class PositiveIntegerString extends ValueObject<number> {
    protected constructor(value: number) {
        super(value);
    }

    public static validateString(value: number | string, errorPrefix: string) {
        if (typeof value !== 'number') {
            if (isNaN(parseInt(value, 10))) {
                throw new TypeError(
                    errorPrefix +
                        `PositiveIntegerString => the given value (${value}: ${typeof value}) has to be a number or a string representing a number!`
                );
            }

            return parseInt(value, 10);
        } else {
            return value;
        }
    }

    public static validate(value: number | string, errorPrefix: string) {
        return PositiveNumber.validate(this.validateString(value, errorPrefix), errorPrefix);
    }

    public static validateWithInterval(value: number | string, min: number, max: number, errorPrefix: string) {
        return PositiveNumber.validateWithInterval(this.validateString(value, errorPrefix), min, max, errorPrefix);
    }

    public static create(value: number | string, options?: IntervalCreationOptions) {
        if (options && options.min !== undefined && options.max !== undefined) {
            return new PositiveIntegerString(
                this.validateWithInterval(value, options.min, options.max, this.pm(options.name))
            );
        } else {
            return new PositiveIntegerString(this.validate(value, this.pm(options?.name)));
        }
    }

    public static fromList(values: string[], options?: IntervalCreationOptions) {
        return values.map((val) => this.create(val, options));
    }

    public static toList(values: PositiveIntegerString[]) {
        return values.map((nes) => nes.value);
    }
}
