import {NonEmptyString} from "../NonEmptyString.js";
import {CreationOptions} from "../ValueObject.js";

export class EmailAddress extends NonEmptyString {

    protected constructor(value: string) {
        super(value);
    }

    public static validate<T extends string>(
        value: T,
        options?: CreationOptions
    ) {
        // RFC 5322 standard 
        const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        NonEmptyString.validate(value, {name: options?.name ?? 'EmailAddress', max: 120, regex});

        return value;
    }

    /**
     * @param value to create a EmailAddress of
     * @param options for the creation
     * @returns the created ValueObject
     */
    public static create(value: string, options?: CreationOptions) {
        return new EmailAddress(this.validate(value, options));
    }
}
