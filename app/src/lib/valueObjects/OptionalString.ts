import { IntervalCreationOptions, ValueObject } from './ValueObject.js';

/** a String that can (by creation) be either `"" | undefined` as well as a conventional string */
export class OptionalString extends ValueObject<string> {
    protected constructor(value: string) {
        super(value);
    }

    /**
     * @param value to be validated
     * @returns the value if the validation was successful
     * @throws {@link TypeError} if not a string (when defined)
     * @throws {@link TypeError} if doesn't fit the given enum (when defined)
     * @throws {@link RangeError} if the value is not inside the interval (when defined)
     */
    public static validate(value: string, options?: IntervalCreationOptions) {
        // type
        if (typeof value !== 'string') {
            throw new TypeError(
                this.pm(options?.name) + `String => the given value (${value}: ${typeof value}) has to be a string!`
            );
        }

        // interval
        if (value.length > 0 && options) {
            if ((options.min && value.length < options.min) || (options.max && value.length > options.max)) {
                throw new RangeError(
                    this.pm(options.name) +
                        `String => the given string's length (${value}) must be in the interval [${options.min ?? 1}, ${
                            options.max ?? Number.MAX_VALUE
                        }]!`
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
    public static create(value: string | undefined, options?: IntervalCreationOptions) {
        return new OptionalString(this.validate(value ?? '', options));
    }

    /**
     * @param values an array of strings to map to an array of ValueObjects
     * @param options for the **individual** creation
     * @returns the array of ValueObjects
     */
    public static fromList(values: string[], options?: IntervalCreationOptions) {
        return values.map((val) => this.create(val, options));
    }

    /**
     * @param values an array of ValueObjects to map to an array of their values
     * @returns the array of values
     */
    public static toList(values: OptionalString[]) {
        return values.map((pes) => pes.value);
    }
}
