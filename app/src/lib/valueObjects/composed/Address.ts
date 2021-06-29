import {NonEmptyString, NonEmptyStringOptions} from "../NonEmptyString.js";
import {PositiveNumber, PositiveNumberOptions} from "../PositiveNumber.js";

export interface AddressSlots {
    street: string; // requires NonEmptyString(120)
    number: number; // requires PositiveNumber (TODO: use regex for using numbers like 10a etc)
    city: string;   // requires NonEmptyString(120)
}

const STREET_CONSTRAINTS: NonEmptyStringOptions = {name: "Address.street",max: 120}
const NUMBER_CONSTRAINTS: PositiveNumberOptions = {name: "Address.number", max: 10000}
const CITY_CONSTRAINTS: PositiveNumberOptions = {name: "Address.city", max: 120}

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
        this._street = NonEmptyString.create(slots.street, STREET_CONSTRAINTS);
        this._number = PositiveNumber.create(slots.number, NUMBER_CONSTRAINTS);
        this._city = NonEmptyString.create(slots.city, CITY_CONSTRAINTS);
    }

    // *** street ****************************************************************
    /** @returns the street of the address */
    get street(): string {
        return this._street.value;
    }
    /** @param street - the street to be set */
    set street(street: string) {
        this._street = NonEmptyString.create(street, STREET_CONSTRAINTS);
    }
    /**
     * checks if the given street is not empty and not longer than 120 letters
     * @param street 
     * @returns ConstraintViolation
     * @public
     */
    static checkStreet(street: string) {
        try {
            NonEmptyString.validate(street, STREET_CONSTRAINTS);
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
        this._number = PositiveNumber.create(number, NUMBER_CONSTRAINTS);
    }
    /**
     * checks if the given number is a positive integer (TODO: change when using regex)
     * @param number 
     * @returns ConstraintViolation
     * @public
     */
    static checkNumber(number: number | string) {
        try {
            if (typeof number === "number" || parseInt(number)) {
                PositiveNumber.validate(+number, NUMBER_CONSTRAINTS);
            }
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
        this._city = NonEmptyString.create(city, CITY_CONSTRAINTS);
    }
    /**
     * checks if the given city is not empty and not longer than 120 letters
     * @param city 
     * @returns ConstraintViolation
     * @public
     */
    static checkCity(city: string) {
        try {
            NonEmptyString.validate(city, CITY_CONSTRAINTS);
            return "";
        } catch (error) {
            console.error(error);
            return "The address' city should not be empty or larger than 120 letters";
        }
    }
    /** @returns the stringified address */
    toString() {
        return `Street: ${this.street}  ${this.number}\nCity: ${this.city}`;
    }   
}