import { AbstractStorage } from "../lib/Storage.js";
import { Pet, SpeciesEnum } from "./Pet.js";
/**
 * internal
 */
class PetStorageClass extends AbstractStorage {
    /** key for the `firestore.collection` for the `this.instances` */
    STORAGE_KEY = "pets";
    /**
     * adds a new Pet created from the given `slots` to the collection of `Pet`s
     * if the slots fulfil their constraints. Does nothing otherwise
     */
    async add(slots) {
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
    async update(slots) {
        await super.updateWithConstructor(Pet, slots);
    }
    async destroy(id) {
        super.destroy(id);
    }
    async clear() {
        await this.retrieveAll();
        await super.clear();
    }
    /**
     * creates a set of 4 `Pet`s and stores it in the first 4 slots of the `this.instances`
     * - TODO: upgrade to always push new pets (requires ID automation)
     */
    async createTestData() {
        try {
            await this.add({ name: "Wolfgang", species: SpeciesEnum.DOG, birthDate: "2020-05-09" });
            await this.add({ name: "Hundula", species: SpeciesEnum.DOG, birthDate: "2019-07-22" });
            await this.add({ name: "Katzarina", species: SpeciesEnum.CAT, birthDate: "2012-11-14" });
            await this.add({ name: "Vogeldemort", species: SpeciesEnum.BIRD, birthDate: "2001-06-08" });
        }
        catch (e) {
            console.warn(`${e.constructor.name}: ${e.message}`);
        }
    }
}
/**
 * a singleton instance of the `PetStorage`.
 * - provides functions to create, retrieve, update and destroy `Pet`s at the `firestore`
 * - additionally provides auxiliary methods for testing
 */
export const PetStorage = new PetStorageClass();
//# sourceMappingURL=PetStorage.js.map