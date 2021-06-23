import {AbstractStorage} from "../lib/Storage.js";
import {Pet, PetSlots} from "./Pet.js";

/**
 * internal
 */
class PetStorageClass extends AbstractStorage<Pet, PetSlots> {
  /** key for the `localStorage[key]` for the `this.instances` */
  STORAGE_KEY = "pets";

  /**
   * adds a new Pet created from the given `slots` to the collection of `Pet`s
   * if the slots fulfil their constraints. Does nothing otherwisey
   */
  add(slots: PetSlots) {
    // the creation is nearly fully abstracted
    super.addWithConstructor( Pet, slots);
  }

  /**
   * updates the `Pet` with the corresponding `slots.petId` and overwrites it's `name`
   */
  update(slots: PetSlots) {
    const {petId: petId, name} = slots;
    var noConstraintViolated = true;
    var updatedProperties = [];
    const pet = this._instances[petId];
    const objectBeforeUpdate = pet.toJSON();

    try {
      // update name
      if (pet.name !== name) {
        pet.name = name;
        updatedProperties.push("name");
      }
    } catch (e) {
      console.warn(`${e.constructor.name}: ${e.message}`);
      noConstraintViolated = false;
      // restore object to its state before updating
      this._instances[petId] = Pet.deserialize(objectBeforeUpdate)!;
    }
    if (noConstraintViolated) {
      if (updatedProperties.length > 0) {
        console.info(
          `Properties ${updatedProperties.toString()} modified for pet ${petId}`,
          pet
        );
      } else {
        console.info(`No property value changed for pet ${petId}!`);
      }
    }
  }

  destroy(petId:string){
    // The deletion is already fully abstracted
    super.destroy(petId);
  }

  /**
   * loads all stored Pets from the `localStorage`, parses them and stores them
   * to the `this.instances`
   */
  retrieveAll() {
    super.retrieveAllWithConstructor(Pet);
  }

  
  /**
   * creates a set of 4 `Pet`s and stores it in the first 4 slots of the `this.instances`
   * - TODO: upgrade to always push new pets (requires ID automation)
   */
  createTestData() {
    try {
      this._instances[0] = new Pet({
        petId: 0,
        name: "Hansi",
      });
      this._instances[1] = new Pet({
        petId: 1,
        name: "Mietzi",
      });
      this._instances[2] = new Pet({
        petId: 2,
        name: "Hundu",
      });
      this._instances[3] = new Pet({
        petId: 3,
        name: "Bojack",
      });
      this.setNextId(4);
      this.persist();
    } catch (e) {
      console.warn(`${e.constructor.name}: ${e.message}`);
    }
  }
}

/**
 * a singleton instance of the `PetStorage`.
 * - provides functions to create, retrieve, update and destroy `Pet`s at the `localStorage`
 * - additionally provides auxiliary methods for testing
 */
export const PetStorage = new PetStorageClass();
