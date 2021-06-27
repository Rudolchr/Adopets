import { IntervalCreationOptions, ValueObject } from './ValueObject.js';

/** a number that is definitely positive */
export class PositiveNumber extends ValueObject<number> {
    protected constructor(value: number) {
        super(value);
    }

    /**
     * @param value to be validated
     * @returns the value if the validation was successful
     * @throws {@link TypeError} if not a positive number
     * @throws {@link RangeError} if the value is not inside the interval
     */
    public static validate(value: number, options?: PositiveNumberOptions) {
        // type
        if (typeof value !== 'number' || value < 0) {
            throw new TypeError(
                this.pm(options?.name) +
                    `PositiveNumber => the given value (${value}: ${typeof value}) has to be a number >= 0!`
            );
        }

        if (options) {
            // interval
            if ((options.min && value < options.min) || (options.max && value > options.max)) {
                throw new RangeError(
                    this.pm(options.name) +
                        `PositiveNumber => the given value (${value}) must be in the interval [${options.min}, ${options.max}]!`
                );
            }
        }

        return value;
    }

    /**
     * @param value to create the ValueObject of
     * @param options for the creation
     * @returns the created ValueObject
     */
    public static create(value: number, options?: PositiveNumberOptions) {
        return new PositiveNumber(this.validate(value, options));
    }

    /**
     * @param values an array of strings to map to an array of ValueObjects
     * @param options for the **individual** creation
     * @returns the array of ValueObjects
     */
    public static fromList(values: number[], options?: PositiveNumberOptions) {
        return values.map((val) => this.create(val, options));
    }

    /**
     * @param values an array of ValueObjects to map to an array of their values
     * @returns the array of values
     */
    public static toList(values: PositiveNumber[]) {
        return values.map((pi) => pi.value);
    }
}

export interface PositiveNumberOptions extends IntervalCreationOptions {}