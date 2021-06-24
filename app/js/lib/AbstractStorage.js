export class AbstractStorage {
    _instances = {};
    _nextId = -1;
    get instances() {
        return this._instances;
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
//# sourceMappingURL=AbstractStorage.js.map