/**
 * @author Christian Prinz
 */
import { Entity } from "../lib/Entity.js";
import { catchValidation } from "../lib/newUtil.js";
import { NonEmptyString } from "../lib/valueObjects/NonEmptyString.js";
import { SafeDate } from "../lib/valueObjects/SafeDate.js";
import { PetStorage } from "./PetStorage.js";
const NAME_CONSTRAINTS = { name: "Pet.name", min: 5, max: 120 };
export var SpeciesEnum;
(function (SpeciesEnum) {
    SpeciesEnum["CAT"] = "Cat";
    SpeciesEnum["DOG"] = "Dog";
    SpeciesEnum["BIRD"] = "Bird";
})(SpeciesEnum || (SpeciesEnum = {}));
const SPECIES_CONSTRAINTS = { name: "Pet.species", range: SpeciesEnum };
const BIRTH_DATE_CONSTRAINTS = { name: "Pet.birthdate", min: "1990-01-01" };
/**
 * The entity of a Pet
 */
export class Pet extends Entity {
    /** the name of the pet
     * - required NonEmptyString(120)
     */
    _name;
    _species;
    _birthDate;
    constructor(slots) {
        super(PetStorage, slots.id);
        this._name = NonEmptyString.create(slots.name, NAME_CONSTRAINTS);
        // TODO
        this._species = NonEmptyString.create(slots.species ?? '', SPECIES_CONSTRAINTS);
        this._birthDate = SafeDate.create(slots.birthDate ?? '2020-20-12', BIRTH_DATE_CONSTRAINTS);
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
        return catchValidation(() => NonEmptyString.validate(name, NAME_CONSTRAINTS), "The pet's name must not be empty or larger than 120 letters!");
    }
    /** @param name - the new name to set */
    set name(name) {
        this._name = NonEmptyString.create(name, NAME_CONSTRAINTS);
    }
    // *** species ****************************************************************
    /** @returns the species of the pet */
    get species() {
        return this._species.value;
    }
    /**
     * checks if the given species is present and between [1,120] letters
     * @param species
     * @returns a ConstraintViolation
     * @public
     */
    static checkSpecies(species) {
        return catchValidation(() => NonEmptyString.validate(species, SPECIES_CONSTRAINTS), "The pet's species must not be either 'Dog', 'Cat', or 'Bird!");
    }
    /** @param species - the new species to set */
    set species(species) {
        this._species = NonEmptyString.create(species, SPECIES_CONSTRAINTS);
    }
    // *** birthDate ****************************************************************
    /** @returns the birthDate of the pet */
    get birthDate() {
        return this._birthDate.value;
    }
    /**
     * checks if the given birthDate is present and between [1,120] letters
     * @param birthDate
     * @returns a ConstraintViolation
     * @public
     */
    static checkBirthDate(birthDate) {
        return catchValidation(() => SafeDate.validate(birthDate, BIRTH_DATE_CONSTRAINTS), "The pet's birthDate must be a valid Date after 01.01.1990!");
    }
    /** @param birthDate - the new birthDate to set */
    set birthDate(birthDate) {
        this._birthDate = SafeDate.create(birthDate, BIRTH_DATE_CONSTRAINTS);
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
                species: slots.species,
                birthDate: slots.birthDate,
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
        return { id: this.id, name: this.name, birthDate: this.birthDate.toJSON(), species: this.species };
    }
    /** @returns the stringified Pet */
    toString() {
        return `Pet{ id: ${this.id}, name: ${this.name} }`;
    }
}
//# sourceMappingURL=Pet.js.map