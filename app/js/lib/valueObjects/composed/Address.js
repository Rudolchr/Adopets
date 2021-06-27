import { NonEmptyString } from "../NonEmptyString";
import { PositiveNumber } from "../PositiveNumber";
const STREET_CONSTRAINTS = { name: "Address.street", max: 120 };
const NUMBER_CONSTRAINTS = { name: "Address.number", max: 10000 };
const CITY_CONSTRAINTS = { name: "Address.city", max: 120 };
export class Address {
    /** the street of the address
     * - requires NonEmptyString(120)
     */
    _street;
    /** the number in the street
     * - requires PositiveInteger
     * TODO: probably change, due to possible numbers like 10a or equals --> regex
     */
    _number;
    /** the city of address
     * - requires NonEmptyString(120)
     */
    _city;
    constructor(slots) {
        this._street = NonEmptyString.create(slots.street, STREET_CONSTRAINTS);
        this._number = PositiveNumber.create(slots.number, NUMBER_CONSTRAINTS);
        this._city = NonEmptyString.create(slots.city, CITY_CONSTRAINTS);
    }
    // *** street ****************************************************************
    /** @returns the street of the address */
    get street() {
        return this._street.value;
    }
    /** @param street - the street to be set */
    set street(street) {
        this._street = NonEmptyString.create(street, STREET_CONSTRAINTS);
    }
    /**
     * checks if the given street is not empty and not longer than 120 letters
     * @param street
     * @returns ConstraintViolation
     * @public
     */
    static checkStreet(street) {
        try {
            NonEmptyString.validate(street, STREET_CONSTRAINTS);
            return "";
        }
        catch (error) {
            console.error(error);
            return "The address' street should not be empty or larger than 120 letters";
        }
    }
    // *** number ****************************************************************
    /** @returns number in the street */
    get number() {
        return this._number.value;
    }
    /** @param number - number in street to set */
    set number(number) {
        this._number = PositiveNumber.create(number, NUMBER_CONSTRAINTS);
    }
    /**
     * checks if the given number is a positive integer (TODO: change when using regex)
     * @param number
     * @returns ConstraintViolation
     * @public
     */
    static checkNumber(number) {
        try {
            // TODO: probably change validation when changing to regex mode
            // TODO: configure the maximum number
            PositiveNumber.validate(number, NUMBER_CONSTRAINTS);
            return "";
        }
        catch (error) {
            console.error(error);
            return "The number of the street must be a positive value!";
        }
    }
    // *** city ******************************************************************
    get city() {
        return this._city.value;
    }
    set city(city) {
        this._city = NonEmptyString.create(city, CITY_CONSTRAINTS);
    }
    /**
     * checks if the given city is not empty and not longer than 120 letters
     * @param city
     * @returns ConstraintViolation
     * @public
     */
    static checkCity(city) {
        try {
            NonEmptyString.validate(city, CITY_CONSTRAINTS);
            return "";
        }
        catch (error) {
            console.error(error);
            return "The address' city should not be empty or larger than 120 letters";
        }
    }
}
//# sourceMappingURL=Address.js.map