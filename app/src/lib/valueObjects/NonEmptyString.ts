import { PossibleEmptyString } from './PossibleEmptyString.js';
import { IntervalCreationOptions } from './ValueObject.js';

/** a String that is definitely a String that is not empty */
export class NonEmptyString extends PossibleEmptyString {
    protected constructor(value: string) {
        super(value);
    }

    /**
     * @param value to be validated
     * @param errorPrefix to show on error messages
     * @param stringEnum an enum the value has to be in
     * @returns the value if the validation was successful
     * @throws {@link TypeError} if not a string or empty
     */
    public static validate<T extends string>(
        value: T,
        errorPrefix: string,
        stringEnum?: NonEmptyStringOptions<T>['stringEnum']
    ) {
        if (typeof value !== 'string' || value === '') {
            throw new TypeError(
                errorPrefix +
                    `NonEmptyString => the given value (${value}: ${typeof value}) has to be a string with length > 0!`
            );
        }
        if (stringEnum && !Object.values(stringEnum).includes(value)) {
            throw new TypeError(
                errorPrefix +
                    `NonEmptyString => the given value (${value}: ${typeof value}) is not in the stringEnum ${JSON.stringify(
                        stringEnum
                    )}`
            );
        }

        return value;
    }

    /**
     * @param value to be validated
     * @param min the lower (inclusive) bound the value must take
     * @param max the upper (inclusive) bound the value must take
     * @param errorPrefix to show on error messages
     * @param stringEnum an enum the value has to be in
     * @returns the value if the validation was successful
     * @throws {@link TypeError} if not a string or empty
     * @throws {@link RangeError} if the value is not inside the interval
     */
    public static validateWithInterval<T extends string>(
        value: T,
        min: number,
        max: number,
        errorPrefix: string,
        stringEnum?: NonEmptyStringOptions<T>['stringEnum']
    ) {
        this.validate(value, errorPrefix, stringEnum);
        if (value.length < min || value.length > max) {
            throw new RangeError(
                errorPrefix +
                    `NonEmptyString => the given string's length (${value}) must be in the interval [${min}, ${max}]!`
            );
        }

        return value;
    }

    /**
     * @param value to create a NonEmptyString of
     * @param options for the creation
     * @returns the created ValueObject
     */
    public static create<T extends string>(value: T, options?: NonEmptyStringOptions<T>) {
        if (options?.min !== undefined && options?.max !== undefined) {
            return new NonEmptyString(
                this.validateWithInterval(value, options.min, options.max, this.pm(options.name))
            );
        } else {
            return new NonEmptyString(this.validate(value, this.pm(options?.name)));
        }
    }

    /**
     * @param values an array of strings to create an array of NonEmptyStrings from
     * @param options for the **individual** creation
     * @returns the array of ValueObjects
     */
    public static fromList<T extends string>(values: T[], options?: NonEmptyStringOptions<T>) {
        return values.map((val) => this.create(val, options));
    }

    /**
     * @param values an array of NonEmptyStrings to convert to an array of strings
     * @returns the array of strings
     */
    public static toList(values: NonEmptyString[]) {
        return values.map((nes) => nes.value);
    }
}

export interface NonEmptyStringOptions<T extends string> extends IntervalCreationOptions {
    /**
     * an Enumeration containing all possible values, the given value can take.
     * String enums must be structured like this:
     * ```typescript
     * enum MyEnum {
     *   first = 'first',
     *   second = 'second',
     *   ...
     *   last = 'last',
     * }
     * ```
     */
    stringEnum?: {
        [s: string]: T;
    };
}
