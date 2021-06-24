import {Entity, EntitySlots} from "./Entity.js";

/**
 * An abstract Storage for Entities. The **Generic** has to be Provided with the stored `Entity` as well 
 * as the `Slots` used for the **constructor** of the Entity.
 */
export abstract class AbstractStorage<E extends Entity, S extends EntitySlots> {
  protected _instances: {[id: string]: E;} = {};
  protected _nextId: number = -1;
  abstract STORAGE_KEY: string;
  protected DB = firebase.firestore();

  /** @returns a map of the Entities from this Storage */
  get instances(): {readonly [id: string]: E;} {
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
  protected async addWithConstructor(EntityConstructor: new (slots: S) => E, slots: Omit<S,'id'>) {
    let entity = null;
    try {
      const collectionRef = this.DB.collection(this.STORAGE_KEY);
      const newEntity = await collectionRef.add(slots);
      entity = new EntityConstructor({id: newEntity.id, ...slots} as unknown as S);
    } catch (e) {
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
  protected async retrieveWithConstructor(EntityConstructor: new (slots: S) => E, id: string): Promise<E> {
    const docRef = this.DB.collection(this.STORAGE_KEY).doc(id);
    let doc: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData> | undefined;
    try {
      doc = await docRef.get();
    } catch (firebaseError) {
      return Promise.reject("Error when reading from firestore\n" + firebaseError);
    }
    let entity: E | null = null;
    try {
      entity = new EntityConstructor({id: doc.id, ...doc.data()} as unknown as S);
      console.log("loaded", {id: doc.id, ...doc.data()});
      return Promise.resolve(entity);
    } catch (constructionError) {
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
  protected async retrieveAllWithConstructor(EntityConstructor: new (slots: S) => E) {
    let collection: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData> | undefined;
    try {
      collection = await this.DB.collection(this.STORAGE_KEY).get();
    } catch (e) {
      alert("Error when reading from firestore\n" + e);
    }
    if (collection !== undefined && !collection.empty) {
      console.info(`${collection.size} entities loaded`);
      collection.docs.forEach(doc => {
        try {
          const entity = new EntityConstructor({id: doc.id, ...doc.data()} as unknown as S);
          console.log("loaded", {id: doc.id, ...doc.data()});
          this._instances[doc.id] = entity;
        } catch (error) {
          console.warn(error);
        }
      });
    }
  }

  abstract update(slots: EntitySlots): void;

  /**
   * deletes the Entity with the given id (`Entity.id`) from the Storage.
   * @param id of the Entity
   */
  async destroy(id: string) {
    try {
      await this.DB.collection(this.STORAGE_KEY).doc(id).delete();
    } catch (e) {
      console.error(`Error when deleting entity: ${e}`);
    }
    if (this._instances[id]) {
      console.info(`${this._instances[id].toString()} deleted`);
      delete this._instances[id];
    } else {
      console.info(
        `There is no entity with id ${id} to delete from the database`
      );
    }
  }

  /**
   * clears all Entities from the `this.instances` as well as the `firestore`
   */
  async clear() {
    try {
      if (confirm("Do you really want to delete all book records?")) {
        // delete all documents
        await Promise.all(Object.keys(this.instances).map(
          entityIds => this.DB.collection(this.STORAGE_KEY).doc(entityIds).delete()));
        this._instances = {};
        console.info("All entities cleared.");
      }
    } catch (e) {
      console.warn(`${e.constructor.name}: ${e.message}`);
    }
  }

  /**
   * checks if an `Entity` with the given `id` exists in the storage.
   * @param id the identifier of the pet to check
   * @returns true if the pet exists in the storage
   */
  contains(id: string) {
    return Object.keys(this._instances).includes(id);
  }
}