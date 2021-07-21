import { CreationOptions, ValueObject } from "./ValueObject.js";

/** a Boolean that is definitely a Boolean that (with option) can be undefined */
export class SafeBoolean extends ValueObject<boolean> {
  protected constructor(value: boolean) {
    super(value);
  }

  /**
   * @param value to be validated
   * @returns the value if the validation was successful
   * @throws {@link TypeError} if undefined (and not allowed to)
   * @throws {@link TypeError} if not a boolean
   */
  public static validate(
    value: string | boolean | undefined,
    options?: SafeBooleanOptions
  ) {
    if (!options?.allowUndefined && value === undefined) {
      throw new TypeError(
        this.pm(options?.name) +
          `SafeBoolean => the given boolean has to be defined!`
      );
    }
    let safeBoolean = value === undefined ? false : value;
    safeBoolean =
      typeof safeBoolean === "boolean"
        ? safeBoolean
        : (JSON.parse(safeBoolean) as boolean);

    // type
    if (typeof safeBoolean !== "boolean") {
      throw new TypeError(
        this.pm(options?.name) +
          `SafeBoolean => the given value (${safeBoolean}: ${typeof safeBoolean}) has to be a boolean!`
      );
    }

    return safeBoolean;
  }

  /**
   * @param value to create the ValueObject of
   * @param options for the creation
   * @returns the created ValueObject
   */
  public static create(value: boolean | string, options?: SafeBooleanOptions) {
    return new SafeBoolean(this.validate(value, options));
  }

  /**
   * @param values an array of booleans to map to an array of ValueObjects
   * @param options for the **individual** creation
   * @returns the array of ValueObjects
   */
  public static fromList(values: boolean[], options?: SafeBooleanOptions) {
    return values.map((val) => this.create(val, options));
  }

  /**
   * @param values an array of ValueObjects to map to an array of their values
   * @returns the array of values
   */
  public static toList(values: SafeBoolean[]) {
    return values.map((nes) => nes.value);
  }

  public equals(obj: SafeBoolean | boolean | string) {
    const value = obj instanceof SafeBoolean ? obj.value : obj;
    let safeBoolean = value === undefined ? false : value;
    safeBoolean =
      typeof safeBoolean === "boolean"
        ? safeBoolean
        : (JSON.parse(safeBoolean) as boolean);

    return safeBoolean === this._value;
  }
}

export interface SafeBooleanOptions extends CreationOptions {
  /** should `undefined` be treated as `false` */
  allowUndefined?: boolean;
  /** maps the boolean to string values used at `SafeBoolean.create()` as well as `SafeBoolean.toJSON()` */
  mapping?: {
    true: string;
    false: string;
  };
}
