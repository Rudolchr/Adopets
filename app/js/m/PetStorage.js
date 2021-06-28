import { AbstractStorage } from "../lib/Storage.js";
import { SafeDate } from "../lib/valueObjects/SafeDate.js";
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
        // the creation is nearly fully abstracted
        await super.addWithConstructor(Pet, slots);
    }
    /**
     * updates the `Pet` with the corresponding `slots.id` and overwrites it's `name`
     */
    async update(slots) {
        const { id, name, species, birthDate } = slots;
        const updateSlots = {};
        const pet = this._instances[id];
        const objectBeforeUpdate = pet.toJSON();
        var noConstraintViolated = true;
        // get the fresh snapshot
        let entity;
        try {
            entity = await this.retrieve(id);
        }
        catch (error) {
            console.warn("could not retrieve the pet to update");
            return;
        }
        // compare props an update instance
        try {
            // update name
            if (entity.name !== name) {
                pet.name = name;
                updateSlots.name = name;
            }
            // update species
            if (entity.species !== species) {
                pet.species = species;
                updateSlots.species = species;
            }
            // update birthDate
            if (SafeDate.create(entity.birthDate).value !== SafeDate.create(birthDate).value) {
                pet.birthDate = birthDate;
                updateSlots.birthDate = birthDate;
            }
        }
        catch (e) {
            console.error("while updating pet property\n" + e);
            noConstraintViolated = false;
            // restore object to its state before updating
            this._instances[id] = Pet.deserialize(objectBeforeUpdate);
        }
        // update the document in the db
        if (noConstraintViolated && Object.keys(updateSlots).length > 0) {
            try {
                await this.DB.collection(this.STORAGE_KEY).doc(id).update(updateSlots);
                console.info(`Properties ${Object.keys(updateSlots)} modified for pet ${id}`, pet);
            }
            catch (error) {
                console.error("while updating pet entry\n" + error);
                // restore object to its state before updating
                this._instances[id] = Pet.deserialize(objectBeforeUpdate);
            }
        }
    }
    async destroy(id) {
        // The deletion is already fully abstracted
        super.destroy(id);
    }
    /**
     * loads a stored Pet from the `firestore`, parses it and stores it to the `this.instances` if
     * successful. ***Throws an Error otherwise***
     * @throws {Error} if no entry found
     */
    async retrieve(id) {
        return super.retrieveWithConstructor(Pet, id);
    }
    /**
     * loads all stored Pets from the `firestore`, parses them and stores them
     * to the `this.instances`
     */
    async retrieveAll() {
        await super.retrieveAllWithConstructor(Pet);
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