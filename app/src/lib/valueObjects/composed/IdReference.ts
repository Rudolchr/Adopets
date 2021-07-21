import { Entity, EntitySlots } from "../../Entity.js";
import { AbstractStorage } from "../../Storage.js";
import { CreationOptions, ValueObject } from "../ValueObject.js";

export class IdReference<To extends Entity<any>> extends ValueObject<string> {
  protected constructor(value: string) {
    super(value);
  }

  public static validate<S extends EntitySlots, E extends Entity<S>>(
    value: string,
    options: IdReferenceOptions<S, E>
  ) {
    // type
    if (!value || typeof value !== "string" || value === "") {
      throw new TypeError(
        this.pm(options.name) +
          `IdReference => the given value (${value}: ${typeof value}) has to be a string with length > 0!`
      );
    }

    // existence in foreign storage
    if (!options.foreignStorage.contains(value)) {
      throw new ReferenceError(
        this.pm(options.name) +
          `IdReference => the given id (${value}) can not be found in the given storage (${options.foreignStorage.STORAGE_KEY})!`
      );
    }

    return value;
  }

  /**
   * @param value to create the ValueObject of
   * @param options for the creation
   * @returns the created ValueObject
   */
  public static create<S extends EntitySlots, E extends Entity<S>>(
    value: string,
    options: IdReferenceOptions<S, E>
  ) {
    return new IdReference<E>(this.validate(value, options));
  }

  /**
   * @param values an array of strings to map to an array of ValueObjects
   * @param options for the **individual** creation
   * @returns the array of ValueObjects
   */
  public static fromList<S extends EntitySlots, E extends Entity<S>>(
    values: string[],
    options: IdReferenceOptions<S, E>
  ) {
    return values.map((val) => this.create(val, options));
  }

  /**
   * @param values an array of ValueObjects to map to an array of their values
   * @returns the array of values
   */
  public static toList(values: IdReference<any>[]) {
    return values.map((nes) => nes.value);
  }

  equals(obj: any): boolean {
    return (obj instanceof IdReference ? obj.value : obj) === this._value;
  }
}

export interface IdReferenceOptions<S extends EntitySlots, E extends Entity<S>>
  extends Partial<CreationOptions> {
  foreignStorage: AbstractStorage<E, S>;
}
