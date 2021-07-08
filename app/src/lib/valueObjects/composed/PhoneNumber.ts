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
        let regex = /^\+(?:[0-9] ?){6,14}[0-9]$/;
        NonEmptyString.validate(value, {name: options?.name ?? 'PhoneNumber', min: 8, max: 30, regex});

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
