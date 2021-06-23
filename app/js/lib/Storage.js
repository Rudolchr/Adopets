export class AbstractStorage {
    _instances = {};
    _nextId = -1;
    get instances() {
        return this._instances;
    }
    addWithConstructor(EntityConstructor, slots) {
        let entity = null;
        try {
            entity = new EntityConstructor(slots);
        }
        catch (e) {
            console.warn(`${e.constructor.name}: ${e.message}`);
            entity = null;
        }
        if (entity) {
            this._instances[entity.id] = entity;
            this.setNextId(entity.id + 1);
            console.info(`${entity.toString()} created`, entity);
        }
    }
    retrieveAllWithConstructor(EntityConstructor) {
        let serialized = "";
        try {
            if (localStorage[this.STORAGE_KEY]) {
                serialized = localStorage[this.STORAGE_KEY];
            }
        }
        catch (e) {
            alert("Error when reading from Local Storage\n" + e);
        }
        if (serialized && serialized.length > 0) {
            const entities = JSON.parse(serialized);
            const keys = Object.keys(entities);
            console.info(`${keys.length} pets loaded`, entities);
            for (const key of keys) {
                const entity = new EntityConstructor(entities[key]);
                if (entity) {
                    this._instances[key] = entity;
                    this.setNextId(Math.max(entity.id + 1, this._nextId));
                }
            }
        }
    }
    destroy(id) {
        if (this._instances[id]) {
            console.info(`${this._instances[id].toString()} deleted`);
            delete this._instances[id];
            id === this._nextId.toString() && this.calculateNextId();
        }
        else {
            console.info(`There is no entity with id ${id} to delete from the database`);
        }
    }
    persist() {
        var serialized = "";
        var error = false;
        const nmrOfEntities = Object.keys(this._instances).length;
        try {
            serialized = JSON.stringify(this._instances);
            localStorage.setItem(this.STORAGE_KEY, serialized);
        }
        catch (e) {
            alert("Error when writing to Local Storage\n" + e);
        }
        !error && console.info(`${nmrOfEntities} entities saved.`);
    }
    clear() {
        try {
            this._instances = {};
            localStorage[this.STORAGE_KEY] = "{}";
            this.setNextId(1);
            console.info("All entities cleared.");
        }
        catch (e) {
            console.warn(`${e.constructor.name}: ${e.message}`);
        }
    }
    contains(id) {
        return Object.keys(this._instances).includes(id.toString());
    }
    calculateNextId() {
        let currentId = -1;
        for (let key of Object.keys(this._instances)) {
            const entity = this._instances[key];
            currentId = Math.max(entity.id, currentId);
        }
        this.setNextId(currentId + 1);
    }
    nextId() {
        if (this._nextId < 0) {
            this.calculateNextId();
        }
        return this._nextId;
    }
    setNextId(id) {
        this._nextId = id;
    }
}
//# sourceMappingURL=Storage.js.map