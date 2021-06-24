import {PositiveNumber} from './PositiveNumber.js';
import {IntervalCreationOptions, ValueObject} from './ValueObject.js';

/** a float that is greater than 0 an can be created from a (valid) string as well as a number */
export class PositiveFloatString extends ValueObject<number> {
    protected constructor(value: number) {
        super(value);
    }

    /**
     * @param value to be validated
     * @param errorPrefix to show on error messages
     * @returns the parsed value if the validation was successful
     * @throws {@link TypeError} if not a parsable number
     */
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

    /**
     * @param value to be validated
     * @param errorPrefix to show on error messages
     * @returns the parsed value if the validation was successful
     * @throws {@link TypeError} if not a positive number (representing string)
     */
    public static validate(value: number | string, errorPrefix: string) {
        return PositiveNumber.validate(this.validateString(value, errorPrefix), errorPrefix);
    }

    /**
     * @param value to be validated
     * @param min the lower (inclusive) bound the value must take
     * @param max the upper (inclusive) bound the value must take
     * @param errorPrefix to show on error messages
     * @returns the value if the validation was successful
     * @throws {@link TypeError} if not a positive number (representing string)
     * @throws {@link RangeError} if the value is not inside the interval
     */
    public static validateWithInterval(value: number | string, min: number, max: number, errorPrefix: string) {
        return PositiveNumber.validateWithInterval(this.validateString(value, errorPrefix), min, max, errorPrefix);
    }

    /**
     * @param value to create a PositiveFloatString from
     * @param options for the creation
     * @returns the created ValueObject
     */
    public static create(value: number | string, options?: IntervalCreationOptions) {
        if (options && options.min !== undefined && options.max !== undefined) {
            return new PositiveFloatString(
                this.validateWithInterval(value, options.min, options.max, this.pm(options.name))
            );
        } else {
            return new PositiveFloatString(this.validate(value, this.pm(options?.name)));
        }
    }

    /**
     * @param values an array of numbers / strings to create an array of PositiveFloatString from
     * @param options for the **individual** creation
     * @returns the array of ValueObjects
     */
    public static fromList(values: (string | number)[], options?: IntervalCreationOptions) {
        return values.map((val) => this.create(val, options));
    }

    /**
     * @param values an array of PositiveFloatString to convert to an array of numbers
     * @returns the array of numbers
     */
    public static toList(values: PositiveFloatString[]) {
        return values.map((nes) => nes.value);
    }

    /**
     * parses the given string to a (float) number where a possible `,` will be correctly replaced by a `.`.
     * @param value to parse (unchecked)
     * @returns the parsed number **OR** `NaN` if not parsable
     */
    public static parse(value: string) {
        return parseFloat(value.replace(',', '.'));
    }
}
