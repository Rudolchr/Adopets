import { PositiveIntegerString } from "./valueObjects/PositiveIntegerString.js";
export class Entity {
    _id;
    constructor(storage, id) {
        Entity.validateUniqueId(storage, id);
        this._id = PositiveIntegerString.create(id, { name: 'Entity.id' });
    }
    get id() {
        return this._id.value;
    }
    static validateUniqueId(storage, id) {
        try {
            if (storage.contains(id)) {
                return "This ID is already taken";
            }
            PositiveIntegerString.validate(id, 'Entity.id');
            return "";
        }
        catch (error) {
            console.error(error);
            return "The ID must be a unique positive number";
        }
    }
    setId(storage, id) {
        Entity.validateUniqueId(storage, id);
        this._id = PositiveIntegerString.create(id);
    }
}
//# sourceMappingURL=Entity.js.map