import {AbstractStorage} from "./Storage.js";
import {NonEmptyString} from "./valueObjects/NonEmptyString.js";

export interface EntitySlots {
  id: string;
}
export abstract class Entity implements EntitySlots {
  /** the unique identifier of the pet
   * - unique required PositiveInteger {id}
   */
  private _id: NonEmptyString;

  /**
   * @param storage of the entity to validate uniqueness of the id
   * @param id the unique identifier
   */
  constructor(storage: AbstractStorage<Entity, any>, id: string) {
    Entity.validateUniqueId(storage, id);
    this._id = NonEmptyString.create(id, {name: 'Entity.id'});
  }

  get id(): string {
    return this._id.value;
  }

  /**
   * checks if the given id is present, >0 and unique
   * @param storage to lookup uniqueness of the id
   * @param id to validate as unique identifier
   * @protected
   */
  protected static validateUniqueId(storage: AbstractStorage<Entity, any>, id: string) {
    try {
      // check uniqueness
      if (storage.contains(id)) {
        return "This ID is already taken";
      }
      NonEmptyString.validate(id, {name: 'Entity.id'});
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
  protected setId(storage: AbstractStorage<Entity, any>, id: string) {
    Entity.validateUniqueId(storage, id);
    this._id = NonEmptyString.create(id);
  }
}