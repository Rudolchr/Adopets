import { ValueObject } from "../ValueObject.js";
export class IdReference extends ValueObject {
    constructor(value) {
        super(value);
    }
    static validate(value, options) {
        // type
        if (!value || typeof value !== 'string' || value === '') {
            throw new TypeError(this.pm(options.name) +
                `IdReference => the given value (${value}: ${typeof value}) has to be a string with length > 0!`);
        }
        // existence in foreign storage
        if (!options.foreignStorage.contains(value)) {
            throw new ReferenceError(this.pm(options.name) +
                `IdReference => the given id (${value}) can not be found in the given storage (${options.foreignStorage.STORAGE_KEY})!`);
        }
        return value;
    }
    /**
     * @param value to create the ValueObject of
     * @param options for the creation
     * @returns the created ValueObject
     */
    static create(value, options) {
        return new IdReference(this.validate(value, options));
    }
    /**
     * @param values an array of strings to map to an array of ValueObjects
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
        return (obj instanceof IdReference ? obj.value : obj) === this._value;
    }
}
//# sourceMappingURL=IdReference.js.map