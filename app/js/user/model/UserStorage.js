import { AbstractStorage } from "../../lib/Storage.js";
import { User } from "./User.js";
/**
 * internal
 */
class UserStorageClass extends AbstractStorage {
    /** key for the `firestore.collection` for the `this.instances` */
    STORAGE_KEY = "users";
    getUserFromMail(email) {
        for (const user of Object.values(this._instances)) {
            if (user.email === email) {
                return user.id;
            }
        }
        return "";
    }
    /**
     * adds a new Pet created from the given `slots` to the collection of `Pet`s
     * if the slots fulfil their constraints. Does nothing otherwise
     */
    async add(slots) {
        await super.addWithConstructor(User, slots);
    }
    /**
     * loads all stored Pets from the `firestore`, parses them and stores them
     * to the `this.instances`
     */
    async retrieveAll() {
        await super.retrieveAllWithConstructor(User);
    }
    /**
     * updates the `Pet` with the corresponding `slots.id` and overwrites it's props if new
     */
    async update(slots) {
        await super.updateWithConstructor(User, slots);
    }
    async destroy(id) {
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
export const UserStorage = new UserStorageClass();
//# sourceMappingURL=UserStorage.js.map