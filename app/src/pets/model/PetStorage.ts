import {AbstractStorage} from "../../lib/Storage.js";
import {Pet, PetSlots} from "./Pet.js";

/**
 * internal
 */
class PetStorageClass extends AbstractStorage<Pet, PetSlots> {
  /** key for the `firestore.collection` for the `this.instances` */
  STORAGE_KEY = "pets";

  retrieveAllFromUser(creatorId: string) {
    let return_instances: {[id: string]: Pet} = {};

    for(const shelter of Object.values(this._instances)) {
        if (shelter.creatorId === creatorId) {
            return_instances[shelter.id] = shelter;
        }
    }

    return return_instances;
}

  /**
   * adds a new Pet created from the given `slots` to the collection of `Pet`s
   * if the slots fulfil their constraints. Does nothing otherwise
   */
  async add(slots: Omit<PetSlots, 'id'>) {
    await super.addWithConstructor(Pet, slots);
  }

  /**
   * loads all stored Pets from the `firestore`, parses them and stores them
   * to the `this.instances`
   */
  async retrieveAll() {
    await super.retrieveAllWithConstructor(Pet);
  }

  /**
   * updates the `Pet` with the corresponding `slots.id` and overwrites it's props if new
   */
  async update(slots: PetSlots) {
    await super.updateWithConstructor(Pet, slots);
  }

  async destroy(id: string) {
    await super.destroy(id);
  }

  async clear() {
    await super.clear();
  }
}

/**
 * a singleton instance of the `PetStorage`.
 * - provides functions to create, retrieve, update and destroy `Pet`s at the `firestore`
 * - additionally provides auxiliary methods for testing
 */
export const PetStorage = new PetStorageClass();
