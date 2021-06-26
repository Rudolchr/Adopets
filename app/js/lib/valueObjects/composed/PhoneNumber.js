import { NonEmptyString } from "../NonEmptyString.js";
export class PhoneNumber extends NonEmptyString {
    constructor(value) {
        super(value);
    }
    static validate(value, options) {
        NonEmptyString.validate(value, { name: options?.name ?? 'PhoneNumber', min: 8, max: 30 });
        let regex = /^\+(?:[0-9] ?){6,14}[0-9]$/;
        if (!regex.test(value)) {
            throw new RangeError(`PhoneNumber => the given phone number (${value}) must start with + and one digit followed by max. 15 digits separated by max. 1 space!`);
        }
        return value;
    }
    /**
     * @param value to create a PhoneNumber of
     * @param options for the creation
     * @returns the created ValueObject
     */
    static create(value, options) {
        return new PhoneNumber(this.validate(value, options));
    }
}
//# sourceMappingURL=PhoneNumber.js.map