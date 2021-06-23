import { AbstractStorage } from "../lib/Storage.js";
import { Pet } from "./Pet.js";
class PetStorageClass extends AbstractStorage {
    STORAGE_KEY = "pets";
    add(slots) {
        super.addWithConstructor(Pet, slots);
    }
    update(slots) {
        const { petId: petId, name } = slots;
        var noConstraintViolated = true;
        var updatedProperties = [];
        const pet = this._instances[petId];
        const objectBeforeUpdate = pet.toJSON();
        try {
            if (pet.name !== name) {
                pet.name = name;
                updatedProperties.push("name");
            }
        }
        catch (e) {
            console.warn(`${e.constructor.name}: ${e.message}`);
            noConstraintViolated = false;
            this._instances[petId] = Pet.deserialize(objectBeforeUpdate);
        }
        if (noConstraintViolated) {
            if (updatedProperties.length > 0) {
                console.info(`Properties ${updatedProperties.toString()} modified for pet ${petId}`, pet);
            }
            else {
                console.info(`No property value changed for pet ${petId}!`);
            }
        }
    }
    destroy(petId) {
        super.destroy(petId);
    }
    retrieveAll() {
        super.retrieveAllWithConstructor(Pet);
    }
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
        }
        catch (e) {
            console.warn(`${e.constructor.name}: ${e.message}`);
        }
    }
}
export const PetStorage = new PetStorageClass();
//# sourceMappingURL=PetStorage.js.map