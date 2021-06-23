import { PositiveNumber } from './PositiveNumber.js';
import { IntervalCreationOptions, ValueObject } from './ValueObject.js';

export class PositiveFloatString extends ValueObject<number> {
    protected constructor(value: number) {
        super(value);
    }

    public static validateString(value: number | string, errorPrefix: string) {
        if (typeof value !== 'number') {
            if (isNaN(this.parse(value))) {
                throw new TypeError(
                    errorPrefix +
                        `PositiveFloatString => the given value (${value}: ${typeof value}) has to be a number or a string representing a number!`
                );
            }

            return this.parse(value);
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
            return new PositiveFloatString(
                this.validateWithInterval(value, options.min, options.max, this.pm(options.name))
            );
        } else {
            return new PositiveFloatString(this.validate(value, this.pm(options?.name)));
        }
    }

    public static fromList(values: string[], options?: IntervalCreationOptions) {
        return values.map((val) => this.create(val, options));
    }

    public static toList(values: PositiveFloatString[]) {
        return values.map((nes) => nes.value);
    }

    public static parse(value: string) {
        return parseFloat(value.replace(',', '.'));
    }
}
