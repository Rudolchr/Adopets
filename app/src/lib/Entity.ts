import {AbstractStorage} from "./Storage.js";
import {PositiveIntegerString} from "./valueObjects/PositiveIntegerString.js";

export abstract class Entity {
  /** the unique identifier of the pet
   * - unique required PositiveInteger {id}
   */
  private _id: PositiveIntegerString;

  /**
   * @param storage of the entity to validate uniqueness of the id
   * @param id the unique identifier
   */
  constructor(storage: AbstractStorage<Entity, any>, id: number | string) {
    Entity.validateUniqueId(storage, id);
    this._id = PositiveIntegerString.create(id, {name: 'Entity.id'});
  }

  get id(): number {
    return this._id.value;
  }

  /**
   * checks if the given id is present, >0 and unique
   * @param storage to lookup uniqueness of the id
   * @param id to validate as unique identifier
   * @protected
   */
  protected static validateUniqueId(storage: AbstractStorage<Entity, any>, id: number | string) {
    try {
      // check uniqueness
      if (storage.contains(id)) {
        return "This ID is already taken";
      }
      PositiveIntegerString.validate(id, 'Entity.id');
      return "";
    } catch (error) {
      console.error(error);
      return "The ID must be a unique positive number";
    }
  }


  /**
   * @param storage of the entity to validate uniqueness of the id
   * @param id the unique identifier
   */
  protected setId(storage: AbstractStorage<Entity, any>, id: number | string) {
    Entity.validateUniqueId(storage, id);
    this._id = PositiveIntegerString.create(id);
  }
}