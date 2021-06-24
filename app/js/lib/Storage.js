/**
 * An abstract Storage for Entities. The **Generic** has to be Provided with the stored `Entity` as well
 * as the `Slots` used for the **constructor** of the Entity.
 */
export class AbstractStorage {
    _instances = {};
    _nextId = -1;
    DB = firebase.firestore();
    /** @returns a map of the Entities from this Storage */
    get instances() {
        return this._instances;
    }
    /**
     * uses the constructor and the slots for an Entity to create and store the Entity.
     * The constructor has to be the actual class of the Entity. In case you would construct the
     * Entity manually by writing `new MyEntity(slots)`, then this function has to get `MyEntity` as
     * the first parameter
     * @param EntityConstructor the actual `class` of the Entity stored in this Storage
     * @param slots that are usually used for the Entity's constructor
     */
    async addWithConstructor(EntityConstructor, slots) {
        let entity = null;
        try {
            const collectionRef = this.DB.collection(this.STORAGE_KEY);
            const newEntity = await collectionRef.add(slots);
            entity = new EntityConstructor({ id: newEntity.id, ...slots });
        }
        catch (e) {
            console.warn(`${e.constructor.name}: ${e.message}`);
            entity = null;
        }
        if (entity) {
            this._instances[entity.id] = entity;
            console.info(`${entity.toString()} created`, entity);
        }
    }
    /**
     * uses the constructor of an Entity to create new Entities from the local stored (stringified)
     * Entities.
     * The constructor has to be the actual class of the Entity. In case you would construct the
     * Entity manually by writing `new MyEntity(slots)`, then this function has to get `MyEntity` as
     * the first parameter
     * @param EntityConstructor the actual `class` of the Entity stored in this Storage
     */
    async retrieveWithConstructor(EntityConstructor, id) {
        const docRef = this.DB.collection(this.STORAGE_KEY).doc(id);
        let doc;
        try {
            doc = await docRef.get();
        }
        catch (firebaseError) {
            return Promise.reject("Error when reading from firestore\n" + firebaseError);
        }
        let entity = null;
        try {
            entity = new EntityConstructor({ id: doc.id, ...doc.data() });
            console.log("loaded", { id: doc.id, ...doc.data() });
            return Promise.resolve(entity);
        }
        catch (constructionError) {
            return Promise.reject(constructionError);
        }
    }
    /**
     * uses the constructor of an Entity to create new Entities from the local stored (stringified)
     * Entities.
     * The constructor has to be the actual class of the Entity. In case you would construct the
     * Entity manually by writing `new MyEntity(slots)`, then this function has to get `MyEntity` as
     * the first parameter
     * @param EntityConstructor the actual `class` of the Entity stored in this Storage
     */
    async retrieveAllWithConstructor(EntityConstructor) {
        let collection;
        try {
            collection = await this.DB.collection(this.STORAGE_KEY).get();
        }
        catch (e) {
            alert("Error when reading from firestore\n" + e);
        }
        if (collection !== undefined && !collection.empty) {
            console.info(`${collection.size} entities loaded`);
            collection.docs.forEach(doc => {
                try {
                    const entity = new EntityConstructor({ id: doc.id, ...doc.data() });
                    console.log("loaded", { id: doc.id, ...doc.data() });
                    this._instances[doc.id] = entity;
                }
                catch (error) {
                    console.warn(error);
                }
            });
        }
    }
    /**
     * deletes the Entity with the given id (`Entity.id`) from the Storage.
     * @param id of the Entity
     */
    async destroy(id) {
        try {
            await this.DB.collection(this.STORAGE_KEY).doc(id).delete();
        }
        catch (e) {
            console.error(`Error when deleting entity: ${e}`);
        }
        if (this._instances[id]) {
            console.info(`${this._instances[id].toString()} deleted`);
            delete this._instances[id];
        }
        else {
            console.info(`There is no entity with id ${id} to delete from the database`);
        }
    }
    /**
     * clears all Entities from the `this.instances` as well as the `firestore`
     */
    async clear() {
        try {
            if (confirm("Do you really want to delete all book records?")) {
                // delete all documents
                await Promise.all(Object.keys(this.instances).map(entityIds => this.DB.collection(this.STORAGE_KEY).doc(entityIds).delete()));
                this._instances = {};
                console.info("All entities cleared.");
            }
        }
        catch (e) {
            console.warn(`${e.constructor.name}: ${e.message}`);
        }
    }
    /**
     * checks if an `Entity` with the given `id` exists in the storage.
     * @param id the identifier of the pet to check
     * @returns true if the pet exists in the storage
     */
    contains(id) {
        return Object.keys(this._instances).includes(id);
    }
}
//# sourceMappingURL=Storage.js.map