import {NonEmptyString} from "../NonEmptyString";
import {PositiveNumber} from "../PositiveNumber";

export interface AddressSlots {
    street: string; // requires NonEmptyString(120)
    number: number; // requires PositiveNumber (TODO: use regex for using numbers like 10a etc)
    city: string;   // requires NonEmptyString(120)
}

export class Address {

    /** the street of the address
     * - requires NonEmptyString(120)
     */
    private _street: NonEmptyString;
    /** the number in the street
     * - requires PositiveInteger
     * TODO: probably change, due to possible numbers like 10a or equals --> regex
     */
    private _number: PositiveNumber;
    /** the city of address
     * - requires NonEmptyString(120)
     */
    private _city: NonEmptyString;

    constructor(slots: AddressSlots) {
        this._street = NonEmptyString.create(slots.street, {
            name: "Address.street",
            min: 0,
            max: 120,
        });
        this._number = PositiveNumber.create(slots.number, {name: "Address.number", max: 10000});
        this._city = NonEmptyString.create(slots.city, {
            name: "Address.city",
            min: 0,
            max: 120,
        });
    }

    // *** street ****************************************************************
    /** @returns the street of the address */
    get street(): string {
        return this._street.value;
    }
    /** @param street - the street to be set */
    set street(street: string) {
        this._street = NonEmptyString.create(street, {name: "Address.street", max: 120});
    }
    /**
     * checks if the given street is not empty and not longer than 120 letters
     * @param street 
     * @returns ConstraintViolation
     * @public
     */
    static checkStreet(street: string) {
        try {
            NonEmptyString.validate(street, {name: "Address.street", max: 120});
            return "";
        } catch (error) {
            console.error(error);
            return "The address' street should not be empty or larger than 120 letters";
        }
    }
    // *** number ****************************************************************
    /** @returns number in the street */
    get number(): number {
        return this._number.value;
    }
    /** @param number - number in street to set */
    set number(number: number) {
        this._number = PositiveNumber.create(number, {name: "Address.number", max: 10000});
    }
    /**
     * checks if the given number is a positive integer (TODO: change when using regex)
     * @param number 
     * @returns ConstraintViolation
     * @public
     */
    static checkNumber(number: number) {
        try {
            // TODO: probably change validation when changing to regex mode
            // TODO: configure the maximum number
            PositiveNumber.validate(number, {name: "Address.number", max: 10000});
            return "";
        } catch (error) {
            console.error(error);
            return "The number of the street must be a positive value!";
        }
    }
    // *** city ******************************************************************
    get city(): string {
        return this._city.value;
    }
    set city(city: string) {
        this._city = NonEmptyString.create(city, {name: "Address.city", max: 120});
    }
    /**
     * checks if the given city is not empty and not longer than 120 letters
     * @param city 
     * @returns ConstraintViolation
     * @public
     */
    static checkCity(city: string) {
        try {
            NonEmptyString.validate(city, {name: "Address.city", max: 120});
            return "";
        } catch (error) {
            console.error(error);
            return "The address' city should not be empty or larger than 120 letters";
        }
    }
}