import { ValueObject } from "./ValueObject.js";
/** a Boolean that is definitely a Boolean that (with option) can be undefined */
export class SafeBoolean extends ValueObject {
    constructor(value) {
        super(value);
    }
    /**
     * @param value to be validated
     * @returns the value if the validation was successful
     * @throws {@link TypeError} if undefined (and not allowed to)
     * @throws {@link TypeError} if not a boolean
     */
    static validate(value, options) {
        if (!options?.allowUndefined && value === undefined) {
            throw new TypeError(this.pm(options?.name) +
                `SafeBoolean => the given boolean has to be defined!`);
        }
        let safeBoolean = value === undefined ? false : value;
        safeBoolean =
            typeof safeBoolean === "boolean"
                ? safeBoolean
                : JSON.parse(safeBoolean);
        // type
        if (typeof safeBoolean !== "boolean") {
            throw new TypeError(this.pm(options?.name) +
                `SafeBoolean => the given value (${safeBoolean}: ${typeof safeBoolean}) has to be a boolean!`);
        }
        return safeBoolean;
    }
    /**
     * @param value to create the ValueObject of
     * @param options for the creation
     * @returns the created ValueObject
     */
    static create(value, options) {
        return new SafeBoolean(this.validate(value, options));
    }
    /**
     * @param values an array of booleans to map to an array of ValueObjects
     * @param options for the **individual** creation
     * @returns the array of ValueObjects
     */
    static fromList(values, options) {
        return values.map((val) => this.create(val, options));
    }
    /**
     * @param values an array of ValueObjects to map to an array of their values
     * @returns the array of values
     */
    static toList(values) {
        return values.map((nes) => nes.value);
    }
    equals(obj) {
        const value = obj instanceof SafeBoolean ? obj.value : obj;
        let safeBoolean = value === undefined ? false : value;
        safeBoolean =
            typeof safeBoolean === "boolean"
                ? safeBoolean
                : JSON.parse(safeBoolean);
        return safeBoolean === this._value;
    }
}
//# sourceMappingURL=SafeBoolean.js.map