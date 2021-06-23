import {Entity} from "./Entity.js";

export abstract class AbstractStorage<E extends Entity, EntitySlots> {
  protected _instances: {[id: string]: E;} = {};
  protected _nextId: number = -1;
  abstract STORAGE_KEY: string;

  get instances(): {[id: string]: E;} {
    return this._instances;
  }

  protected addWithConstructor(EntityConstructor: new (slots: EntitySlots) => E,slots: EntitySlots) {
    let entity = null;
    try {
      entity = new EntityConstructor(slots);
    } catch (e) {
      console.warn(`${e.constructor.name}: ${e.message}`);
      entity = null;
    }
    if (entity) {
      this._instances[entity.id] = entity;
      this.setNextId(entity.id + 1);
      console.info(`${entity.toString()} created`, entity);
    }
  }

  protected retrieveAllWithConstructor(EntityConstructor: new (slots: EntitySlots) => E | null){
    let serialized = "";
    try {
      if (localStorage[this.STORAGE_KEY]) {
        serialized = localStorage[this.STORAGE_KEY];
      }
    } catch (e) {
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
          // store the current highest id (for receiving the next id later)
          this.setNextId(Math.max(entity.id + 1, this._nextId));
        }
      }
    }
  }

  abstract update(slots: EntitySlots): void;

  destroy(id: string) {
    if (this._instances[id]) {
      console.info(`${this._instances[id].toString()} deleted`);
      delete this._instances[id];
      // calculate nextId when last id is destroyed
      id === this._nextId.toString() && this.calculateNextId();
    } else {
      console.info(
        `There is no entity with id ${id} to delete from the database`
      );
    }
  }

  persist(){
    var serialized = "";
    var error = false;
    const nmrOfEntities = Object.keys(this._instances).length;
    try {
      serialized = JSON.stringify(this._instances);
      localStorage.setItem(this.STORAGE_KEY, serialized);
    } catch (e) {
      alert("Error when writing to Local Storage\n" + e);
    }

    !error && console.info(`${nmrOfEntities} entities saved.`);
  }


  /**
   * clears all `Movie`s from the `this.instances`
   */
  clear() {
    try {
      this._instances = {};
      localStorage[this.STORAGE_KEY] = "{}";
      this.setNextId(1);
      console.info("All entities cleared.");
    } catch (e) {
      console.warn(`${e.constructor.name}: ${e.message}`);
    }
  }

  /**
   * checks if an `Entity` with the given `id` exists in the storage.
   * @param id the identifier of the pet to check
   * @returns true if the pet exists in the storage
   */
  contains(id: number | string) {
    return Object.keys(this._instances).includes(id.toString());
  }

  /*****************************************************************************
   *** ID creation *************************************************************
   *****************************************************************************/

  /**
   * calculates the next possible id and stores it internally to `this._nextId`
   */
  calculateNextId() {
    let currentId = -1;
    for (let key of Object.keys(this._instances)) {
      const entity = this._instances[key];
      currentId = Math.max(entity.id, currentId);
    }
    this.setNextId(currentId + 1);
  }

  /**
   * looks up the current highest identifier and returns the following identifier to use for
   * a possible `Pet` to add next.
   * @returns the next identifier to use
   */
  nextId() {
    // calculate the missing id if not already done
    if (this._nextId < 0) {
      this.calculateNextId();
    }

    return this._nextId;
  }

  protected setNextId(id: number) {
    this._nextId = id;
  }
}