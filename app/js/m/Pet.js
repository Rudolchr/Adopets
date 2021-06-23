import { Entity } from "../lib/Entity.js";
import { NonEmptyString } from "../lib/valueObjects/NonEmptyString.js";
import { PetStorage } from "./PetStorage.js";
export class Pet extends Entity {
    _name;
    constructor(slots) {
        super(PetStorage, slots.petId);
        this._name = NonEmptyString.create(slots.name, {
            name: "Pet.name",
            min: 0,
            max: 120,
        });
    }
    get petId() {
        return this.id;
    }
    static checkPetId(petId) {
        return this.validateUniqueId(PetStorage, petId);
    }
    set petId(petId) {
        this.setId(PetStorage, petId);
    }
    get name() {
        return this._name.value;
    }
    static checkName(name) {
        try {
            NonEmptyString.validateWithInterval(name, 0, 120, "Pet.petId");
            return "";
        }
        catch (error) {
            console.error(error);
            return "The pet's name must not be empty or larger than 120 letters";
        }
    }
    set name(name) {
        this._name = NonEmptyString.create(name);
    }
    static deserialize(slots) {
        let pet = null;
        try {
            pet = new Pet({
                petId: slots.petId,
                name: slots.name,
            });
        }
        catch (e) {
            console.warn(`${e.constructor.name} while deserializing a pet: ${e.message}`);
            pet = null;
        }
        return pet;
    }
    toJSON() {
        return { petId: this.petId, name: this.name };
    }
    toString() {
        return `Pet{ id: ${this.petId}, name: ${this.name} }`;
    }
}
//# sourceMappingURL=Pet.js.map