import { AbstractStorage } from "../lib/Storage.js";
import { Shelter, ShelterSlots } from "./Shelter.js";
/**
 * internal
 */
class ShelterStorageClass extends AbstractStorage<Shelter, ShelterSlots> {
    /** key for the `firestore.collection` for the `this.instances` */
    STORAGE_KEY = "shelters";
    /**
     * adds a new Shelter created from the given `slots` to the collection of `Shelters`s
     * if the slots fulfil their constraints. Does nothing otherwise
     */
    async add(slots: Omit<ShelterSlots, 'id'>) {
        // the creation is nearly fully abstracted
        await super.addWithConstructor(Shelter, slots);
    }
    /**
     * updates the `Shelter` with the corresponding `slots.id` and overwrites it's `name`
     */
    async update(slots: ShelterSlots) {
        // TODO
    }
    async destroy(id: string) {
        // TODO
    }
    /**
     * loads a stored Shelter from the `firestore`, parses it and stores it to the `this.instances` if
     * successful. ***Throws an Error otherwise***
     * @throws {Error} if no entry found
     */
    async retrieve(id: string) {
        return super.retrieveWithConstructor(Shelter, id);
    }
    /**
     * loads all stored Shelters from the `firestore`, parses them and stores them
     * to the `this.instances`
     */
    async retrieveAll() {
        await super.retrieveAllWithConstructor(Shelter);
    }
    async clear() {
        await this.retrieveAll();
        await super.clear();
    }

    // TODO: createTestData() 
}

/**
 * a singleton instance of the `ShelterStorage`.
 * - provides functions to create, retrieve, update and destroy `Shelters`s at the `firestore`
 * - additionally provides auxiliary methods for testing
 */
export const ShelterStorage = new ShelterStorageClass();