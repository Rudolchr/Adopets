import { CreationOptions, ValueObject } from './ValueObject.js';

/** a Date that is definitely a Date that can be created from either a Date or a string that 
 * represents a Date or a number that represents the Time in ms */
export class SafeDate extends ValueObject<Date> {
    protected constructor(value: Date) {
        super(value);
    }

    /**
     * @param value to be validated
     * @param errorPrefix to show on error messages
     * @returns the value if the validation was successful
     * @throws {@link TypeError} if not parsable to a valid Date
     */
    public static validate(value: Dateable, errorPrefix: string) {
        if (typeof value === 'string' || typeof value === 'number') {
            if (typeof value === 'string' ? isNaN(Date.parse(value)) : isNaN(value)) {
                throw new TypeError(
                    errorPrefix + `SafeDate => the given (${value}: ${typeof value}) is not parsable!`
                );
            } else {
                return new Date(value);
            }
        } else if (!(value instanceof Date)) {
            throw new TypeError(
                errorPrefix +
                    `SafeDate => the given (${value}: ${typeof value}) is whether a Date nor a string | number!`
            );
        } else {
            return value;
        }
    }

    /**
     * @param value to be validated
     * @param min the (inclusive) minimum Date the value can be
     * @param max the (inclusive) maximum Date the value can be
     * @param errorPrefix to show on error messages
     * @returns the value if the validation was successful
     * @throws {@link TypeError} if any of the Dates is not parsable
     * @throws {@link RangeError} if the value is not inside the interval
     */
    public static validateWithInterval(value: Dateable, min: Dateable, max: Dateable, errorPrefix: string) {
        const safeValue = this.validate(value, errorPrefix);
        const safeMin = this.validate(min, errorPrefix + '.min');
        const safeMax = this.validate(max, errorPrefix + '.max');
        if (safeValue.getTime() < safeMin.getTime() || safeValue.getTime() > safeMax.getTime()) {
            throw new RangeError(
                errorPrefix +
                    `SafeDate => the given Date (${safeValue}) must be in the interval [${safeMin}, ${safeMax}]!`
            );
        }

        return safeValue;
    }

    /**
     * @param value to create a SafeDate of
     * @param options for the creation
     * @returns the created ValueObject
     */
    public static create(value: Dateable, options?: DateCreationOptions) {
        if (options && options.min !== undefined && options.max !== undefined) {
            return new SafeDate(this.validateWithInterval(value, options.min, options.max, this.pm(options.name)));
        } else {
            return new SafeDate(this.validate(value, this.pm(options?.name)));
        }
    }

    /**
     * @param values an array of parsable Dates to create an array of SafeDates from
     * @param options for the **individual** creation
     * @returns the array of ValueObjects
     */
    public static fromList(values: [Dateable], options?: DateCreationOptions) {
        return values.map((val) => this.create(val, options));
    }

    /**
     * @param values an array of SafeDates to convert to an array of Dates
     * @returns the array of strings
     */
    public static toList(values: SafeDate[]) {
        return values.map((pi) => pi.value);
    }

    /* @ts-ignore */
    toJSON() {
        // TODO it works but check why this can't be the super.toJSON()
        return this._value.toJSON();
    }
}

export type Dateable = Date | string | number;

export interface DateCreationOptions extends CreationOptions {
    max?: Dateable;
    min?: Dateable;
}
