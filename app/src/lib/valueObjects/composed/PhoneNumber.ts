import {NonEmptyString} from "../NonEmptyString.js";
import {CreationOptions} from "../ValueObject.js";

export class PhoneNumber extends NonEmptyString {

    protected constructor(value: string) {
        super(value);
    }

    public static validate<T extends string>(
        value: T,
        options?: CreationOptions
    ) {
        NonEmptyString.validate(value, {name: options?.name ?? 'PhoneNumber', min: 8, max: 30});
        let regex = /^\+(?:[0-9] ?){6,14}[0-9]$/;
        if (!regex.test(value)) {
            throw new RangeError(
                `PhoneNumber => the given phone number (${value}) must start with + and one digit followed by max. 15 digits separated by max. 1 space!`
            );
        }

        return value;
    }

    /**
     * @param value to create a PhoneNumber of
     * @param options for the creation
     * @returns the created ValueObject
     */
    public static create(value: string, options?: CreationOptions) {
        return new PhoneNumber(this.validate(value, options));
    }
}
