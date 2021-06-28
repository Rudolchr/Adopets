export abstract class ValueObject<T> {
    protected _value: T;

    protected constructor(value: T) {
        this._value = value;
    }

    /**
     * creates a pre-error string message that can be used to extend error messages, depending on
     * if the name of the ValueObject is given
     * @param n name of the ValueObject (where it takes place)
     * @returns the pre error string
     */
    protected static pm(n: string | undefined) {
        return n ? n + '->' : '';
    }

    /**
     * the actual value of this ValueObject
     */
    public get value() {
        return this._value;
    }

    /**
     * compares if the given value is either an equal ValueObject, or an equal value which would create an equal ValueObject
     * @param obj to compare of equality
     */
    abstract equals(obj: ValueObject<T> | any): boolean;

    /**
     * this function is invoked by `JSON.stringify()` and converts the inner `"_propertyKey"` to `"propertyKey"`
     * "Gesamtkonto {NonEmptyString}"
     * @returns {{}} the value
     */
    toJSON() {
        return this._value;
    }
}

/**
 * Options that every ValueObject must provide
 */
export interface CreationOptions {
    /**
     * the name of the ValueObject to identify in a possible ErrorMessage.
     * - eg: `'MealPlan.price'`
     */
    name?: string;
}

/**
 * The extended `CreationOptions` that every ValueObject should provide, if the Object allows to
 * have a Range.
 * - eg.: `PositiveInteger` within a specific Interval like `[0, 100]`
 * - eg.: `NonEmptyString` that has to have a specific length
 */
export interface IntervalCreationOptions extends CreationOptions {
    /**
     * the lower bound of the interval the value has to be in
     */
    min?: number;
    /**
     * the upper bound of the interval the value has to be in
     */
    max?: number;
}
