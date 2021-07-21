import { NonEmptyString } from "./valueObjects/NonEmptyString.js";
export class Entity {
    /** the unique identifier of the pet
     * - unique required PositiveInteger {id}
     */
    _id;
    /**
     * @param storage of the entity to validate uniqueness of the id
     * @param id the unique identifier
     */
    constructor(storage, id) {
        Entity.validateUniqueId(storage, id);
        this._id = NonEmptyString.create(id, { name: "Entity.id" });
    }
    get id() {
        return this._id.value;
    }
    /**
     * checks if the given id is present, >0 and unique
     * @param storage to lookup uniqueness of the id
     * @param id to validate as unique identifier
     * @protected
     */
    static validateUniqueId(storage, id) {
        try {
            // check uniqueness
            if (storage.contains(id)) {
                return "This ID is already taken";
            }
            NonEmptyString.validate(id, { name: "Entity.id" });
            return "";
        }
        catch (error) {
            console.error(error);
            return "The ID must be a unique positive number";
        }
    }
    /**
     * @param storage of the entity to validate uniqueness of the id
     * @param id the unique identifier
     */
    setId(storage, id) {
        Entity.validateUniqueId(storage, id);
        this._id = NonEmptyString.create(id);
    }
}
//# sourceMappingURL=Entity.js.map