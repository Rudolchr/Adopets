import {Entity, EntitySlots} from "./Entity.js";

/**
 * An abstract Storage for Entities. The **Generic** has to be Provided with the stored `Entity` as well 
 * as the `Slots` used for the **constructor** of the Entity.
 */
export abstract class AbstractStorage<E extends Entity<any>, S extends EntitySlots> {
  protected _instances: {[id: string]: E;} = {};
  protected _nextId: number = -1;
  abstract STORAGE_KEY: string;
  protected DB = firebase.firestore();

  /** @returns a map of the Entities from this Storage */
  get instances(): {readonly [id: string]: E;} {
    return this._instances;
  }

  /** -------------------------------------------------------------------------
   * CREATE -------------------------------------------------------------------
   * ------------------------------------------------------------------------*/

  abstract add(slots: Omit<S, 'id'>): Promise<void>;

  /**
   * uses the constructor and the slots for an Entity to create and store the Entity.
   * The constructor has to be the actual class of the Entity. In case you would construct the 
   * Entity manually by writing `new MyEntity(slots)`, then this function has to get `MyEntity` as 
   * the first parameter
   * @param EntityConstructor the actual `class` of the Entity stored in this Storage
   * @param slots that are usually used for the Entity's constructor
   */
  protected async addWithConstructor(EntityConstructor: new (slots: S) => E, slots: Omit<S, 'id'>) {
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

  /** -------------------------------------------------------------------------
   * RETRIEVE -----------------------------------------------------------------
   * ------------------------------------------------------------------------*/

  /**
   * uses the constructor of an Entity to create new Entities from the local stored (stringified) 
   * Entities.
   * The constructor has to be the actual class of the Entity. In case you would construct the 
   * Entity manually by writing `new MyEntity(slots)`, then this function has to get `MyEntity` as 
   * the first parameter
   * @param EntityConstructor the actual `class` of the Entity stored in this Storage
   */
  private async retrieveWithConstructor(EntityConstructor: new (slots: S) => E, id: string): Promise<E> {
    const docRef = this.DB.collection(this.STORAGE_KEY).doc(id);
    let doc: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData> | undefined;
    try {
      doc = await docRef.get();
    } catch (firebaseError) {
      return Promise.reject(`Error when reading entity (${id}) from firestore\n` + firebaseError);
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

  abstract retrieveAll(): Promise<void>;

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
      alert(`Error when reading all entities from firestore\n` + e);
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

  /** -------------------------------------------------------------------------
   * UPDATE -------------------------------------------------------------------
   * ------------------------------------------------------------------------*/

  abstract update(slots: S): Promise<void>;

  /**
   * updates the entity for the given slots in the local instances as well as in the firestore. 
   * This function uses the Entities constructor for restoring the old entity after a failed update.
   * @param EntityConstructor the actual `class` of the Entity stored in this Storage
   * @param slots that are usually used for the Entity's constructor
   */
  async updateWithConstructor(EntityConstructor: new (slots: S) => E, slots: S) {
    const {id} = slots;
    let updateSlots: Partial<S> = {};
    const instance = this._instances[id];
    var updateFailed = false;

    // get the fresh snapshot
    let entity: E;
    try {
      entity = await this.retrieveWithConstructor(EntityConstructor, id);
    } catch (error) {
      console.warn(`could not retrieve the entity (${id}) to update:\n` + error);
      return;
    }

    // compare props an update instance
    try {
      updateSlots = entity.update(slots);
    } catch (e) {
      console.error(`while updating entity (${id}) property\n` + e);
      updateFailed = true;
    }

    // update the document in the db and the instance
    if (!updateFailed && Object.keys(updateSlots).length > 0) {
      try {
        await this.DB.collection(this.STORAGE_KEY).doc(id).update(updateSlots);
        this._instances[id] = entity;
        console.info(
          `Properties ${Object.keys(updateSlots).join(', ')} modified for entity ${id}: ${JSON.stringify(entity)}`);
      } catch (error) {
        console.error(`while updating entity (${id}) on firebase\n` + error);
        updateFailed = true;
      }
    }

    if (updateFailed) {
      try {
        // restore object to its state before updating
        this._instances[id] = instance;
        console.info(`Destroy corrupted entity (${id}). `);
        this.destroy(id);
      } catch (error) {
        console.error(`while restoring entity (${id}) after failed update:\n` + error);
      }
    }
  }

  /** -------------------------------------------------------------------------
   * DESTROY ------------------------------------------------------------------
   * ------------------------------------------------------------------------*/

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
      // if (confirm("Do you really want to delete all book records?")) {
      const collection = await this.DB.collection(this.STORAGE_KEY).get();
      if (collection !== undefined && !collection.empty) {
        // delete all documents
        await Promise.all(
          collection.docs.map(doc => this.DB.collection(this.STORAGE_KEY).doc(doc.id).delete())
        );
      }
      this._instances = {};
      console.info("All entities cleared.");
      // }
    } catch (e) {
      console.warn(`${e.constructor.name}: ${e.message}`);
    }
  }

  /** -------------------------------------------------------------------------
   * HELPER -------------------------------------------------------------------
   * ------------------------------------------------------------------------*/

  /**
   * checks if an `Entity` with the given `id` exists in the storage.
   * @param id the identifier of the pet to check
   * @returns true if the pet exists in the storage
   */
  async contains(id: string) {
    try {
      const docRef = this.DB.collection(this.STORAGE_KEY).doc(id);
      const doc = await docRef.get();
      return doc.exists;
    } catch (firebaseError) {
      console.error(`Error when reading entity (${id}) from firestore\n` + firebaseError);
      return false;
    }
  }
}