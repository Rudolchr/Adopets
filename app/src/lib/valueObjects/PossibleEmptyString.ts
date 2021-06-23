import { IntervalCreationOptions, ValueObject } from './ValueObject.js';

export class PossibleEmptyString extends ValueObject<string> {
    protected constructor(value: string) {
        super(value);
    }

    /** @throws {TypeError} */
    public static validate(value: string, errorPrefix: string) {
        if (typeof value !== 'string') {
            throw new TypeError(
                errorPrefix + `String => the given value (${value}: ${typeof value}) has to be a string!`
            );
        }

        return value;
    }

    /** @throws {RangeError} */
    public static validateWithInterval(value: string, min: number, max: number, errorPrefix: string) {
        this.validate(value, errorPrefix);
        if (value.length > 0 && (value.length < min || value.length > max)) {
            throw new RangeError(
                errorPrefix +
                    `String => the given string's length (${value}) must be in the interval [${min}, ${max}] or empty!`
            );
        }

        return value;
    }

    public static create(value: string | undefined, options?: IntervalCreationOptions) {
        if (options?.min !== undefined && options?.max !== undefined) {
            return new PossibleEmptyString(
                this.validateWithInterval(value ?? '', options.min, options.max, this.pm(options.name))
            );
        } else {
            return new PossibleEmptyString(this.validate(value ?? '', this.pm(options?.name)));
        }
    }

    public static fromList(values: string[], options?: IntervalCreationOptions) {
        return values.map((val) => this.create(val, options));
    }

    public static toList(values: PossibleEmptyString[]) {
        return values.map((pes) => pes.value);
    }
}
