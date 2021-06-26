/**
 * @author Christian Prinz
 */
import { Entity } from "../lib/Entity.js";
import { NonEmptyString } from "../lib/valueObjects/NonEmptyString.js";
import { PetStorage } from "./PetStorage.js";
/**
 * The entity of a Pet
 */
export class Pet extends Entity {
    /** the name of the pet
     * - required NonEmptyString(120)
     */
    _name;
    constructor(slots) {
        super(PetStorage, slots.id);
        this._name = NonEmptyString.create(slots.name, {
            name: "Pet.name",
            min: 0,
            max: 120,
        });
    }
    // *** name ****************************************************************
    /** @returns the name of the pet */
    get name() {
        return this._name.value;
    }
    /**
     * checks if the given name is present and between [1,120] letters
     * @param name
     * @returns a ConstraintViolation
     * @public
     */
    static checkName(name) {
        try {
            NonEmptyString.validate(name, { name: 'Pet.name', min: 0, max: 120 });
            return "";
        }
        catch (error) {
            console.error(error);
            return "The pet's name must not be empty or larger than 120 letters";
        }
    }
    /** @param name - the new name to set */
    set name(name) {
        this._name = NonEmptyString.create(name, {
            name: "Pet.name",
            min: 0,
            max: 120,
        });
    }
    // *** serialization ********************************************************
    /**
     * a static function that creates a `new Pet` from a serialized one.
     * @returns a new `Pet` with the corresponding slots if they pass their constraints. `null` otherwise.
     */
    static deserialize(slots) {
        let pet = null;
        try {
            pet = new Pet({
                id: slots.id,
                name: slots.name,
            });
        }
        catch (e) {
            console.warn(`${e.constructor.name} while deserializing a pet: ${e.message}`);
            pet = null;
        }
        return pet;
    }
    /**
     * this function is invoked by `JSON.stringify()` and converts the inner `"_propertyKey"` to `"propertyKey"`
     * @override the inherited toJSON()
     */
    toJSON() {
        return { id: this.id, name: this.name };
    }
    /** @returns the stringified Pet */
    toString() {
        return `Pet{ id: ${this.id}, name: ${this.name} }`;
    }
}
//# sourceMappingURL=Pet.js.map