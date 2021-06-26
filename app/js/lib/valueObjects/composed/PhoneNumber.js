import { NonEmptyString } from "../NonEmptyString.js";
export class PhoneNumber extends NonEmptyString {
    constructor(value) {
        super(value);
    }
    static validate(value, options) {
        let regex = /^\+(?:[0-9] ?){6,14}[0-9]$/;
        NonEmptyString.validate(value, { name: options?.name ?? 'PhoneNumber', min: 8, max: 30, regex });
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