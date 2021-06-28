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
    public static validate(value: Dateable, options?: SafeDateOptions) {
        // safe date
        let safeDate: Date;
        if (typeof value === 'string' || typeof value === 'number') {
            if (typeof value === 'string' ? isNaN(Date.parse(value)) : isNaN(value)) {
                throw new TypeError(
                    this.pm(options?.name) + `SafeDate => the given (${value}: ${typeof value}) is not parsable!`
                );
            } else {
                safeDate = new Date(value);
            }
        } else if (!(value instanceof Date)) {
            throw new TypeError(
                this.pm(options?.name) +
                    `SafeDate => the given (${value}: ${typeof value}) is whether a Date nor a string | number!`
            );
        } else {
            safeDate = value;
        }

        if (options) {
            // interval
            const safeMin =
                options.min !== undefined ? this.validate(options.min, { name: options.name + '.min' }) : undefined;
            const safeMax =
                options.max !== undefined ? this.validate(options.max, { name: options.name + '.max' }) : undefined;
            if (
                (safeMin && safeDate.getTime() < safeMin.getTime()) ||
                (safeMax && safeDate.getTime() > safeMax.getTime())
            ) {
                throw new RangeError(
                    this.pm(options.name) +
                        `SafeDate => the given Date (${safeDate}) must be in the interval [${safeMin ?? '*'}, ${
                            safeMax ?? '*'
                        }]!`
                );
            }
        }

        return safeDate;
    }

    /**
     * @param value to create a PositiveIntegerString from
     * @param options for the creation
     * @returns the created ValueObject
     */
    public static create(value: Dateable, options?: SafeDateOptions) {
        return new SafeDate(this.validate(value, options));
    }

    /**
     * @param values an array of strings to map to an array of ValueObjects
     * @param options for the **individual** creation
     * @returns the array of ValueObjects
     */
    public static fromList(values: [Dateable], options?: SafeDateOptions) {
        return values.map((val) => this.create(val, options));
    }

    /**
     * @param values an array of ValueObjects to map to an array of their values
     * @returns the array of values
     */
    public static toList(values: SafeDate[]) {
        return values.map((pi) => pi.value);
    }

    public equals(obj: SafeDate | Dateable){
        if (obj instanceof SafeDate){
            return obj.value === this._value;
        } else {
            const comparable = SafeDate.create(obj, {name: 'SafeDate.equals'});
            return comparable.value === this._value;
        }
    }

    /* @ts-ignore */
    toJSON() {
        // TODO it works but check why this can't be the super.toJSON()
        return this._value.toJSON();
    }
}

export type Dateable = Date | string | number;

export interface SafeDateOptions extends CreationOptions {
    max?: Dateable;
    min?: Dateable;
}
