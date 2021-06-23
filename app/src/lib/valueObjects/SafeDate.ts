import { CreationOptions, ValueObject } from './ValueObject.js';

export class SafeDate extends ValueObject<Date> {
    protected constructor(value: Date) {
        super(value);
    }

    /** @throws {TypeError} */
    public static validate(value: Dateable, errorPrefix: string) {
        if (typeof value === 'string' || typeof value === 'number') {
            if (typeof value === 'string' ? isNaN(Date.parse(value)) : isNaN(value)) {
                throw new TypeError(
                    errorPrefix + `SafeDate => the given (${value}: ${typeof value}) is not parseable!`
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

    /** @throws {RangeError} */
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

    public static create(value: Dateable, options?: DateCreationOptions) {
        if (options && options.min !== undefined && options.max !== undefined) {
            return new SafeDate(this.validateWithInterval(value, options.min, options.max, this.pm(options.name)));
        } else {
            return new SafeDate(this.validate(value, this.pm(options?.name)));
        }
    }

    public static fromList(values: [Dateable], options?: DateCreationOptions) {
        return values.map((val) => this.create(val, options));
    }

    public static toList(values: SafeDate[]) {
        return values.map((pi) => pi.value);
    }

    /* @ts-ignore */
    toJSON() {
        return this._value.toJSON();
    }
}

export type Dateable = Date | string | number;

export interface DateCreationOptions extends CreationOptions {
    max?: Dateable;
    min?: Dateable;
}
