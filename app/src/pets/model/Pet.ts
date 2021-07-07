/**
 * @author Christian Prinz
 */
import {Entity, EntitySlots} from "../../lib/Entity.js";
import {catchValidation, catchValidations} from "../../lib/newUtil.js";
import {IdReference, IdReferenceOptions} from "../../lib/valueObjects/composed/IdReference.js";
import {NonEmptyString, NonEmptyStringOptions} from "../../lib/valueObjects/NonEmptyString.js";
import {SafeBoolean, SafeBooleanOptions} from "../../lib/valueObjects/SafeBoolean.js";
import {Dateable, SafeDate, SafeDateOptions} from "../../lib/valueObjects/SafeDate.js";
import {listEquals} from "../../lib/valueObjects/ValueObject.js";
import {Shelter, ShelterSlots} from "../../shelters/model/Shelter.js";
import {ShelterStorage} from "../../shelters/model/ShelterStorage.js";
import {PetStorage} from "./PetStorage.js";

export interface PetSlots extends EntitySlots {
  name: string;
  species: string;
  sex: string;
  size: string;
  birthDate: Dateable;
  vaccinationStatus: string;
  compatibleWith: string[];
  suitableWith: string[];
  housing: string;
  isAdopted: string | boolean;
  shelterId: string;
  creatorId: string;
}
const NAME_CONSTRAINTS: NonEmptyStringOptions = {name: 'Pet.name', max: 120};
export enum SpeciesEnum {CAT = 'Cat', DOG = 'Dog', BIRD = 'Bird'}
const SPECIES_CONSTRAINTS: NonEmptyStringOptions = {name: 'Pet.species', range: SpeciesEnum};
export enum SexEnum {MALE = 'male', FEMALE = 'female', UNKNOWN = 'unknown'}
const SEX_CONSTRAINTS: NonEmptyStringOptions = {name: 'Pet.sex', range: SexEnum};
export enum SizeEnum {SMALL = 'small', MEDIUM = 'medium', LARGE = 'large', VERY_LARGE = 'very large'}
const SIZE_CONSTRAINTS: NonEmptyStringOptions = {name: 'Pet.size', range: SizeEnum};
const BIRTH_DATE_CONSTRAINTS: SafeDateOptions = {name: 'Pet.birthdate', min: '1990-01-01'};
const VACCINATION_STATUS_CONSTRAINTS: NonEmptyStringOptions = {name: 'Pet.vaccinationStatus', max: 500};
const COMPATIBLE_WITH_CONSTRAINTS: NonEmptyStringOptions = {name: 'Pet.compatibleWith', range: SpeciesEnum};
export enum SuitableWithEnum {CHILDREN = 'children', SENIORS = 'seniors'}
const SUITABLE_WITH_CONSTRAINTS: NonEmptyStringOptions = {name: 'Pet.suitableWith', range: SuitableWithEnum};
export enum HousingEnum {INDOOR_ONLY = 'indoor only', IN_AND_OUT = 'in- and outdoor', OUTDOOR_REQUIRED = 'outdoor required'}
const HOUSING_CONSTRAINTS: NonEmptyStringOptions = {name: 'Pet.housing', range: HousingEnum};
const IS_ADOPTED_CONSTRAINTS: SafeBooleanOptions = {name: 'Pet.isAdopted'};
const SHELTER_ID_CONSTRAINTS: IdReferenceOptions<ShelterSlots, Shelter> = {name: 'Pet.shelter', foreignStorage: ShelterStorage};


/**
 * The entity of a Pet
 */
export class Pet extends Entity<PetSlots> {
  private _name: NonEmptyString;
  private _species: NonEmptyString;
  private _sex: NonEmptyString;
  private _size: NonEmptyString;
  private _birthDate: SafeDate;
  private _vaccinationStatus: NonEmptyString;
  private _compatibleWith: NonEmptyString[];
  private _suitableWith: NonEmptyString[];
  private _housing: NonEmptyString;
  private _isAdopted: SafeBoolean;
  private _shelterId: IdReference<Shelter>;
  private _creatorId: NonEmptyString;

  constructor(slots: PetSlots) {
    super(PetStorage, slots.id);
    this._name = NonEmptyString.create(slots.name, NAME_CONSTRAINTS);
    this._species = NonEmptyString.create(slots.species, SPECIES_CONSTRAINTS);
    this._sex = NonEmptyString.create(slots.sex, SEX_CONSTRAINTS);
    this._size = NonEmptyString.create(slots.size, SIZE_CONSTRAINTS);
    this._birthDate = SafeDate.create(slots.birthDate, BIRTH_DATE_CONSTRAINTS);
    this._vaccinationStatus = NonEmptyString.create(slots.vaccinationStatus, VACCINATION_STATUS_CONSTRAINTS);
    this._compatibleWith = NonEmptyString.fromList(slots.compatibleWith, COMPATIBLE_WITH_CONSTRAINTS);
    this._suitableWith = NonEmptyString.fromList(slots.suitableWith, SUITABLE_WITH_CONSTRAINTS);
    this._housing = NonEmptyString.create(slots.housing, HOUSING_CONSTRAINTS);
    this._isAdopted = SafeBoolean.create(slots.isAdopted, IS_ADOPTED_CONSTRAINTS);
    this._shelterId = IdReference.create(slots.shelterId, SHELTER_ID_CONSTRAINTS);
    this._creatorId = NonEmptyString.create(slots.creatorId);
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
    // update sex
    if (!this._sex.equals(slots.sex)) {
      this.sex = slots.sex;
      updateSlots.sex = slots.sex;
    }
    // update size
    if (!this._size.equals(slots.size)) {
      this.size = slots.size;
      updateSlots.size = slots.size;
    }
    // update birthDate
    if (!this._birthDate.equals(slots.birthDate)) {
      this.birthDate = slots.birthDate;
      updateSlots.birthDate = slots.birthDate;
    }
    // update vaccinationStatus
    if (!this._vaccinationStatus.equals(slots.vaccinationStatus)) {
      this.vaccinationStatus = slots.vaccinationStatus;
      updateSlots.vaccinationStatus = slots.vaccinationStatus;
    }
    // update compatibleWith
    if (!listEquals(this._compatibleWith, slots.compatibleWith)) {
      this.compatibleWith = slots.compatibleWith;
      updateSlots.compatibleWith = slots.compatibleWith;
    }
    // update suitableWith
    if (!listEquals(this._suitableWith, slots.suitableWith)) {
      this.suitableWith = slots.suitableWith;
      updateSlots.suitableWith = slots.suitableWith;
    }
    // update housing
    if (!this._housing.equals(slots.housing)) {
      this.housing = slots.housing;
      updateSlots.housing = slots.housing;
    }
    // update isAdopted
    if (!this._isAdopted.equals(slots.isAdopted)) {
      this.isAdopted = slots.isAdopted;
      updateSlots.isAdopted = slots.isAdopted;
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

  static checkSpecies(species: string) {
    return catchValidation(() =>
      NonEmptyString.validate(species, SPECIES_CONSTRAINTS),
      "The pet's species must be either 'Dog', 'Cat', or 'Bird!"
    );

  }

  /** @param species - the new species to set */
  set species(species: string) {
    this._species = NonEmptyString.create(species, SPECIES_CONSTRAINTS);
  }

  // *** sex ****************************************************************

  /** @returns the sex of the pet */
  get sex(): string {
    return this._sex.value;
  }
  static checkSex(sex: string) {
    return catchValidation(() =>
      NonEmptyString.validate(sex, SEX_CONSTRAINTS),
      "The pet's sex must be either 'male', 'female', or 'unknown!"
    );

  }
  set sex(sex: string) {
    this._sex = NonEmptyString.create(sex, SEX_CONSTRAINTS);
  }

  // *** size ****************************************************************

  /** @returns the size of the pet */
  get size(): string {
    return this._size.value;
  }
  static checkSize(size: string) {
    return catchValidation(() =>
      NonEmptyString.validate(size, SIZE_CONSTRAINTS),
      "The pet's size must be either 'small', 'medium', 'large', or 'very large'!"
    );

  }
  set size(size: string) {
    this._size = NonEmptyString.create(size, SIZE_CONSTRAINTS);
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

  // *** vaccinationStatus ****************************************************************

  /** @returns the vaccinationStatus of the pet */
  get vaccinationStatus(): string {
    return this._vaccinationStatus.value;
  }
  static checkVaccinationStatus(vaccinationStatus: string) {
    return catchValidation(() =>
      NonEmptyString.validate(vaccinationStatus, VACCINATION_STATUS_CONSTRAINTS),
      "The pet's vaccinationStatus must not be empty or > 500 letters!"
    );

  }
  set vaccinationStatus(vaccinationStatus: string) {
    this._vaccinationStatus = NonEmptyString.create(vaccinationStatus, VACCINATION_STATUS_CONSTRAINTS);
  }

  // *** compatibleWith ****************************************************************

  /** @returns the list of species pet is compatible with */
  get compatibleWith(): string[] {
    return NonEmptyString.toList(this._compatibleWith);
  }
  static checkCompatibleWith(compatibleWith: string[]) {
    return catchValidations(compatibleWith, (value) =>
      NonEmptyString.validate(value, COMPATIBLE_WITH_CONSTRAINTS),
      "The pet can only be compatible with existing species"
    );

  }
  set compatibleWith(compatibleWith: string[]) {
    this._compatibleWith = NonEmptyString.fromList(compatibleWith, COMPATIBLE_WITH_CONSTRAINTS);
  }

  // *** suitableWith ****************************************************************

  /** @returns the list of species pet is compatible with */
  get suitableWith(): string[] {
    return NonEmptyString.toList(this._suitableWith);
  }
  static checkSuitableWith(suitableWith: string[]) {
    return catchValidations(suitableWith, (value) =>
      NonEmptyString.validate(value, SUITABLE_WITH_CONSTRAINTS),
      "The pet can only be compatible with existing species"
    );
  }
  set suitableWith(suitableWith: string[]) {
    this._suitableWith = NonEmptyString.fromList(suitableWith, SUITABLE_WITH_CONSTRAINTS);
  }

  // *** housing ****************************************************************

  /** @returns the housing of the pet */
  get housing(): string {
    return this._housing.value;
  }
  static checkHousing(housing: string) {
    return catchValidation(() =>
      NonEmptyString.validate(housing, HOUSING_CONSTRAINTS),
      "The pet's housing must be either 'indoor only', 'in- and outdoor', or 'outdoor required'!"
    );

  }
  set housing(housing: string) {
    this._housing = NonEmptyString.create(housing, HOUSING_CONSTRAINTS);
  }

  // *** isAdopted ****************************************************************

  /** @returns the isAdopted of the pet */
  get isAdopted(): boolean {
    return this._isAdopted.value;
  }
  static checkIsAdopted(isAdopted: boolean | string) {
    return catchValidation(() =>
      SafeBoolean.validate(isAdopted, IS_ADOPTED_CONSTRAINTS),
      "The pet's isAdopted must be true or false!"
    );

  }
  set isAdopted(isAdopted: boolean | string) {
    this._isAdopted = SafeBoolean.create(isAdopted, IS_ADOPTED_CONSTRAINTS);
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

  // *** creatorId ***********************************************************
  get creatorId(): string {
    return this._creatorId.value;
  }
  set creatorId(creatorId: string) {
      this._creatorId = NonEmptyString.create(creatorId);
  }

  // *** serialization ********************************************************

  /**
   * this function is invoked by `JSON.stringify()` and converts the inner `"_propertyKey"` to `"propertyKey"`
   * @override the inherited toJSON()
   */
  toJSON(): PetSlots {
    const result = {
      ...this,
      birthDate: this.birthDate.toJSON(),
    };
    return result;
  }

  /** @returns the stringified Pet */
  toString() {
    return `Pet{ id: ${this.id}, name: ${this.name} }`;
  }
}
