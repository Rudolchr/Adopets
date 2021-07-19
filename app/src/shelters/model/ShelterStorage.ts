import {AbstractStorage} from "../../lib/Storage.js";
import { PetStorage } from "../../pets/model/PetStorage.js";
import {Shelter, ShelterSlots} from "./Shelter.js";
/**
 * internal
 */
class ShelterStorageClass extends AbstractStorage<Shelter, ShelterSlots> {
    /** key for the `firestore.collection` for the `this.instances` */
    STORAGE_KEY = "shelters";

    getUserShelters(creatorId: string) {
        let return_instances: {[id: string]: Shelter} = {};

        for(const shelter of Object.values(this._instances)) {
            if (shelter.creatorId === creatorId) {
                return_instances[shelter.id] = shelter;
            }
        }

        return return_instances;
    }

    getUserShelterIds(creatorId: string) {
        let return_ids: string[] = [];

        for(const shelter of Object.values(this._instances)) {
            if (shelter.creatorId === creatorId) {
                return_ids.push(shelter.id);
            }
        }

        return return_ids;
    }

    /**
     * adds a new Shelter created from the given `slots` to the collection of `Shelters`s
     * if the slots fulfil their constraints. Does nothing otherwise
     */
    async add(slots: Omit<ShelterSlots, 'id'>) {
        await super.addWithConstructor(Shelter, slots);
    }

    /**
     * loads all stored Shelters from the `firestore`, parses them and stores them
     * to the `this.instances`
     */
    async retrieveAll() {
        await super.retrieveAllWithConstructor(Shelter);
    }

    /**
     * updates the `Shelter` with the corresponding `slots.id` and overwrites it's `name`
     */
    async update(slots: ShelterSlots) {
        await super.updateWithConstructor(Shelter, slots);
    }

    async destroy(id: string) {
        await super.destroy(id);
        // PetStorage.destroyShelterRefs(id);
    }

    async clear() {
        await super.clear();
    }
}

/**
 * a singleton instance of the `ShelterStorage`.
 * - provides functions to create, retrieve, update and destroy `Shelters`s at the `firestore`
 * - additionally provides auxiliary methods for testing
 */
export const ShelterStorage = new ShelterStorageClass();