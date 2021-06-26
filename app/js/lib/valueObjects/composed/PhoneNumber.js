import { NonEmptyString } from "../NonEmptyString.js";
export class PhoneNumber extends NonEmptyString {
    constructor(value) {
        super(value);
    }
    static validate(value, errorPrefix, stringEnum) {
        NonEmptyString.validateWithInterval(value, 8, 30, errorPrefix);
        let regex = /^\+(?:[0-9] ?){6,14}[0-9]$/;
        if (!regex.test(value)) {
            throw new RangeError(errorPrefix +
                `PhoneNumberFormat => the given phone number (${value}) must start with + and one digit followed by max. 15 digits seperated by max. 1 space!`);
        }
        return value;
    }
    /**
     * @param value to create a PhoneNumber of
     * @param options for the creation
     * @returns the created ValueObject
     */
    static create(value) {
        return new PhoneNumber(value);
    }
}
//# sourceMappingURL=PhoneNumber.js.map