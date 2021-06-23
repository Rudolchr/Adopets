/**
 * @author Christian Prinz
 */
import {Entity} from "../lib/Entity.js";
import {NonEmptyString} from "../lib/valueObjects/NonEmptyString.js";
import {PetStorage} from "./PetStorage.js";

export interface PetSlots {
  petId: number | string;
  name: string;
}

/**
 * The entity of a Pet
 */
export class Pet extends Entity {
  /** the name of the pet
   * - required NonEmptyString(120)
   */
  private _name: NonEmptyString;

  constructor(slots: PetSlots) {
    super(PetStorage, slots.petId);
    this._name = NonEmptyString.create(slots.name, {
      name: "Pet.name",
      min: 0,
      max: 120,
    });
  }

  // *** petId **************************************************************

  /**
   * @returns the unique identifier of the pet
   */
  get petId(): number {
    return this.id;
  }

  /**
   * checks if the given petId is present, >0 and unique
   * @param petId
   */
  static checkPetId(petId: number | string) {
    return this.validateUniqueId(PetStorage, petId);
  }

  /**
   * sets a new petId
   * - @private this is just used internally though the id is frozen
   * @param petId
   */
  set petId(petId: number | string) {
    this.setId(PetStorage, petId);
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
    try {
      NonEmptyString.validateWithInterval(name, 0, 120, "Pet.petId");
      return "";
    } catch (error) {
      console.error(error);
      return "The pet's name must not be empty or larger than 120 letters";
    }
  }

  /** @param name - the new name to set */
  set name(name) {
    this._name = NonEmptyString.create(name);
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
        petId: slots.petId,
        name: slots.name,
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
    return { petId: this.petId, name: this.name };
  }

  /** @returns the stringified Pet */
  toString() {
    return `Pet{ id: ${this.petId}, name: ${this.name} }`;
  }
}
