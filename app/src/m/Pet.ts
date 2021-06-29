/**
 * @author Christian Prinz
 */
import {Entity, EntitySlots} from "../lib/Entity.js";
import {catchValidation} from "../lib/newUtil.js";
import {IdReference, IdReferenceOptions} from "../lib/valueObjects/composed/IdReference.js";
import {NonEmptyString, NonEmptyStringOptions} from "../lib/valueObjects/NonEmptyString.js";
import {Dateable, SafeDateOptions, SafeDate} from "../lib/valueObjects/SafeDate.js";
import {PetStorage} from "./PetStorage.js";
import {Shelter, ShelterSlots} from "./Shelter.js";
import {ShelterStorage} from "./ShelterStorage.js";

export interface PetSlots extends EntitySlots {
  name: string;
  species: string;
  birthDate: Dateable;
  shelterId: string
}
const NAME_CONSTRAINTS: NonEmptyStringOptions = {name: "Pet.name", max: 120};
export enum SpeciesEnum {CAT = 'Cat', DOG = 'Dog', BIRD = 'Bird'}
const SPECIES_CONSTRAINTS: NonEmptyStringOptions = {name: "Pet.species", range: SpeciesEnum};
const BIRTH_DATE_CONSTRAINTS: SafeDateOptions = {name: "Pet.birthdate", min: "1990-01-01"};
const SHELTER_ID_CONSTRAINTS: IdReferenceOptions<ShelterSlots, Shelter> = {name: "Pet.shelter", foreignStorage: ShelterStorage};


/**
 * The entity of a Pet
 */
export class Pet extends Entity<PetSlots> {
  private _name: NonEmptyString;
  private _species: NonEmptyString;
  private _birthDate: SafeDate;
  private _shelterId: IdReference<Shelter>;

  constructor(slots: PetSlots) {
    super(PetStorage, slots.id);
    this._name = NonEmptyString.create(slots.name, NAME_CONSTRAINTS);
    this._species = NonEmptyString.create(slots.species, SPECIES_CONSTRAINTS);
    this._birthDate = SafeDate.create(slots.birthDate, BIRTH_DATE_CONSTRAINTS);
    this._shelterId = IdReference.create(slots.shelterId, SHELTER_ID_CONSTRAINTS)
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
    // update shelter
    if (!this._shelterId.equals(slots.shelterId)) {
        this.shelterId = slots.shelterId;
        updateSlots.shelterId = slots.shelterId;
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

  // *** shelterId ****************************************************************

  /** @returns the shelterId of the pet */
  get shelterId(): string {
    return this._shelterId.value;
  }

  /**
   * checks if the given shelterId is present and between [1,120] letters
   * @param shelterId
   * @returns a ConstraintViolation
   * @public
   */
  static checkShelterId(shelterId: string) {
    return catchValidation(() =>
      IdReference.validate(shelterId, SHELTER_ID_CONSTRAINTS),
      "The pet's shelter does not exist!");
  }

  /** @param shelterId - the new shelterId to set */
  set shelterId(shelterId: string) {
    this._shelterId = IdReference.create(shelterId, SHELTER_ID_CONSTRAINTS);
  }

  // *** serialization ********************************************************

  /**
   * this function is invoked by `JSON.stringify()` and converts the inner `"_propertyKey"` to `"propertyKey"`
   * @override the inherited toJSON()
   */
  toJSON(): PetSlots {
    return {id: this.id, name: this.name, birthDate: this.birthDate.toJSON(), species: this.species, shelterId: this.shelterId};
  }

  /** @returns the stringified Pet */
  toString() {
    return `Pet{ id: ${this.id}, name: ${this.name} }`;
  }
}
