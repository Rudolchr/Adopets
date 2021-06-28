/**
 * @author Christian Prinz
 */
import {Entity, EntitySlots} from "../lib/Entity.js";
import {catchValidation} from "../lib/newUtil.js";
import {NonEmptyString, NonEmptyStringOptions} from "../lib/valueObjects/NonEmptyString.js";
import {Dateable, SafeDateOptions, SafeDate} from "../lib/valueObjects/SafeDate.js";
import {PetStorage} from "./PetStorage.js";

export interface PetSlots extends EntitySlots {
  name: string;
  species: string;
  birthDate: Dateable;
}
const NAME_CONSTRAINTS: NonEmptyStringOptions = {name: "Pet.name", max: 120};
export enum SpeciesEnum {CAT = 'Cat', DOG = 'Dog', BIRD = 'Bird'}
const SPECIES_CONSTRAINTS: NonEmptyStringOptions = {name: "Pet.species", range: SpeciesEnum};
const BIRTH_DATE_CONSTRAINTS: SafeDateOptions = {name: "Pet.birthdate", min: "1990-01-01"};


/**
 * The entity of a Pet
 */
export class Pet extends Entity<PetSlots> {
  /** the name of the pet
   * - required NonEmptyString(120)
   */
  private _name: NonEmptyString;
  private _species: NonEmptyString;
  private _birthDate: SafeDate;

  constructor(slots: PetSlots) {
    super(PetStorage, slots.id);
    this._name = NonEmptyString.create(slots.name, NAME_CONSTRAINTS);
    this._species = NonEmptyString.create(slots.species, SPECIES_CONSTRAINTS);
    this._birthDate = SafeDate.create(slots.birthDate, BIRTH_DATE_CONSTRAINTS);
  }

  /**
   * updates the matching properties for the given slots, if the are different. Afterwards the
   * slots that are different are returned.
   * @param slots to update on this Pet
   * @returns the updated slots (that are different)
   */
  update(slots: PetSlots) {
    const updateSlots: Partial<PetSlots> = {};
    // update name
    if (!this._name.equals(slots.name)) {
      this.name = slots.name;
      updateSlots.name = slots.name;
    }
    // update species
    if (!this._species.equals(slots.species)) {
      this.species = slots.species;
      updateSlots.species = slots.species;
    }
    // update birthDate
    if (!this._birthDate.equals(slots.birthDate)) {
      this.birthDate = slots.birthDate;
      updateSlots.birthDate = slots.birthDate;
    }

    return updateSlots;
  }

  // *** name ****************************************************************

  /** @returns the name of the pet */
  get name(): string {
    return this._name.value;
  }

  /**
   * checks if the given name is present and between [1,120] letters
   * @param name
   * @returns a ConstraintViolation
   * @public
   */
  static checkName(name: string) {
    return catchValidation(() =>
      NonEmptyString.validate(name, NAME_CONSTRAINTS),
      "The pet's name must not be empty or larger than 120 letters!"
    );
  }

  /** @param name - the new name to set */
  set name(name) {
    this._name = NonEmptyString.create(name, NAME_CONSTRAINTS);
  }

  // *** species ****************************************************************

  /** @returns the species of the pet */
  get species(): string {
    return this._species.value;
  }

  /**
   * checks if the given species is present and between [1,120] letters
   * @param species
   * @returns a ConstraintViolation
   * @public
   */
  static checkSpecies(species: string) {
    return catchValidation(() =>
      NonEmptyString.validate(species, SPECIES_CONSTRAINTS),
      "The pet's species must not be either 'Dog', 'Cat', or 'Bird!"
    );

  }

  /** @param species - the new species to set */
  set species(species: string) {
    this._species = NonEmptyString.create(species, SPECIES_CONSTRAINTS);
  }

  // *** birthDate ****************************************************************

  /** @returns the birthDate of the pet */
  get birthDate(): Date {
    return this._birthDate.value;
  }

  /**
   * checks if the given birthDate is present and between [1,120] letters
   * @param birthDate
   * @returns a ConstraintViolation
   * @public
   */
  static checkBirthDate(birthDate: Dateable) {
    return catchValidation(() =>
      SafeDate.validate(birthDate, BIRTH_DATE_CONSTRAINTS),
      "The pet's birthDate must be a valid Date after 01.01.1990!");
  }

  /** @param birthDate - the new birthDate to set */
  set birthDate(birthDate: Dateable) {
    this._birthDate = SafeDate.create(birthDate, BIRTH_DATE_CONSTRAINTS);
  }

  // *** serialization ********************************************************

  /**
   * a static function that creates a `new Pet` from a serialized one.
   * @returns a new `Pet` with the corresponding slots if they pass their constraints. `null` otherwise.
   */
  static deserialize(slots: PetSlots) {
    let pet = null;
    try {
      pet = new Pet({
        id: slots.id,
        name: slots.name,
        species: slots.species,
        birthDate: slots.birthDate,
      });
    } catch (e) {
      console.warn(
        `${e.constructor.name} while deserializing a pet: ${e.message}`
      );
      pet = null;
    }
    return pet;
  }

  /**
   * this function is invoked by `JSON.stringify()` and converts the inner `"_propertyKey"` to `"propertyKey"`
   * @override the inherited toJSON()
   */
  toJSON(): PetSlots {
    return {id: this.id, name: this.name, birthDate: this.birthDate.toJSON(), species: this.species};
  }

  /** @returns the stringified Pet */
  toString() {
    return `Pet{ id: ${this.id}, name: ${this.name} }`;
  }
}
