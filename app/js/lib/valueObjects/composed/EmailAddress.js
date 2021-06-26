import { NonEmptyString } from "../NonEmptyString.js";
export class EmailAddress extends NonEmptyString {
    constructor(value) {
        super(value);
    }
    static validate(value, options) {
        // RFC 5322 standard 
        const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        NonEmptyString.validate(value, { name: options?.name ?? 'EmailAddress', max: 120, regex });
        return value;
    }
    /**
     * @param value to create a EmailAddress of
     * @param options for the creation
     * @returns the created ValueObject
     */
    static create(value, options) {
        return new EmailAddress(this.validate(value, options));
    }
}
//# sourceMappingURL=EmailAddress.js.map