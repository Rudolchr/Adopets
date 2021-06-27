/**
 * @author Max Bergmann
 */
import {Entity, EntitySlots} from "../lib/Entity.js";
import {catchValidation} from "../lib/newUtil.js";
import {Address, AddressSlots} from "../lib/valueObjects/composed/Address.js";
import {EmailAddress} from "../lib/valueObjects/composed/EmailAddress.js";
import {PhoneNumber} from "../lib/valueObjects/composed/PhoneNumber.js";
import {NonEmptyString, NonEmptyStringOptions} from "../lib/valueObjects/NonEmptyString.js";
import {ShelterStorage} from "./ShelterStorage.js";

export interface ShelterSlots extends EntitySlots {
    name: string;
    address: AddressSlots;
    phone: string;
    email: string;
    officeHours: string;
    description: string;
}

const NAME_CONSTRAINTS: NonEmptyStringOptions = {name: "Shelter.name", max: 120};
const PHONE_CONSTRAINTS: NonEmptyStringOptions = {name: "Shelter.phone"};
const EMAIL_CONSTRAINTS: NonEmptyStringOptions = {name: "Shelter.email"};

export class Shelter extends Entity {
    /** the name of the shelter
     * - requires NonEmptyString(120)
     */
    private _name: NonEmptyString;
    /** the address of the shelter
     * - requires AddressFormat(street, number, city) TODO
     */
    private _address: Address;
    /** the phone number of the shelter 
     * - requires NonEmptyString(15)
     * - requires matching regex = /^\+(?:[0-9] ?){6,14}[0-9]$/
     */
    private _phone: PhoneNumber;
    /** the email address of the shelter
     * - requires EmailFormat TODO
     */
    private _email: EmailAddress;
    /** the office hours of the shelter
     * TODO: requirement
     */
    private _officeHours: string;
    /**
     * optional description of the shelter (max. 500 letters)
     */
    private _description: string;
    /** 
     * list of pett IDs of pets assigned to this shelter
     */
    // private _pets;
    /**
     * list of contact messages TODO
     */
    // private _messages;

    constructor(slots: ShelterSlots) {
        super(ShelterStorage, slots.id);
        this._name = NonEmptyString.create(slots.name, NAME_CONSTRAINTS);
        this._address = new Address(slots.address);
        this._phone = PhoneNumber.create(slots.phone, PHONE_CONSTRAINTS);
        this._email = EmailAddress.create(slots.email, EMAIL_CONSTRAINTS);
        this._officeHours = slots.officeHours;
        this._description = slots.description;
    }

    // *** name ****************************************************************
    /** @returns the name of the shelter */
    get name(): string {
        return this._name.value;
    }
    /** @param name - the name of shelter to be set */
    set name(name: string) {
        this._name = NonEmptyString.create(name, NAME_CONSTRAINTS);
    }
    /**
     * checks if the given name is not empty and has a maximum of 120 letters
     * @param name 
     * @returns ConstraintViolation
     * @public
     */
    static checkName(name: string) {
        return catchValidation(() =>
            NonEmptyString.validate(name, NAME_CONSTRAINTS),
            "The shelter's name must not be empty or larger than 120 letters!"
        );
    }
    // *** address *************************************************************
    /** @returns the address of the shelter */
    get address(): AddressSlots {
        return this._address;
    }
    /** @param address - the address of the shelter to be set */
    set address(address: AddressSlots) {
        this._address = new Address(address);
    }
    /**
     * checks if the given shelter address is given and consists of street, number and city
     * @param address 
     * @returns ConstraintViolation
     * @public
     */
    static checkAddress(address: AddressSlots) {
        return catchValidation(() => {
            Address.checkStreet(address.street);
            Address.checkCity(address.city);
            Address.checkNumber(address.number);
        }, "The shelters address is not in the given format!");
    }
    // *** phone ***************************************************************
    /** @returns phone number of this shelter */
    get phone(): string {
        return this._phone.value;
    }
    /** @param phone - the phone number of shelter to be set */
    set phone(phone: string) {
        this._phone = PhoneNumber.create(phone, PHONE_CONSTRAINTS);
    }
    /**
     * checks if the given phone number is given and consists of maximum 15 numbers and only numbers
     * @param phone
     * @returns Constraint Violation
     * @public
     */
    static checkPhone(phone: string) {
        return catchValidation(() =>
            PhoneNumber.validate(phone, PHONE_CONSTRAINTS),
            "The shelters phone number is not given or nor in given Format!"
        );
    }
    // *** email ***************************************************************
    /** @returns the shelters email address */
    get email(): string {
        return this._email.value;
    }
    /** @param email - email address of shelter to set */
    set email(email: string) {
        this._email = EmailAddress.create(email, EMAIL_CONSTRAINTS);
    }
    /**
     * checks if the given email address is legit ([number,letters,sybols]@[letters].[letters])
     * @param email  
     * @returns Constraint Violation
     * @public
     */
    static checkEmail(email: string) {
        return catchValidation(() =>
            EmailAddress.validate(email, EMAIL_CONSTRAINTS),
            "The shelter's email address is not legit!"
        );
    }
    // *** officeHours *********************************************************
    // /** @returns office hours of this shelter */
    // get officeHours() {
    //     return this._officeHours.value;
    // }
    // /** @param officeHours - officeHours of the shelter to set */
    // set officeHours(officeHours) {
    //     // TODO: replace NonEmptyString by something else
    //     this._officeHours = NonEmptyString.create(officeHours);
    // }
    // /**
    //  * checks if the officeHours are given and matching teh constraints (TODO)
    //  * @param officeHours 
    //  * @returns ConstraintViolation
    //  * @public 
    //  */
    // static checkOfficeHours(officeHours) {
    //     try {
    //         // TODO: replace NonEmptyString by something else
    //         NonEmptyString.validateWithInterval(officeHours, 1, 120, "Shelter.officeHours");
    //         return "";
    //     }
    //     catch (error) {
    //         console.error(error);
    //         return "The shelter's office hours are not matching the constraints!";
    //     }
    // }
    // // *** description *********************************************************
    // /** @returns the description of this shelter */
    // get description() {
    //     return this._description.value;
    // }
    // /** @param description - of the shelter */
    // set description(description) {
    //     this._description = NonEmptyString.create(description);
    // }
    // /**
    //  * checks if the given description is not to long (max. 500 letters)
    //  * @param description 
    //  * @returns ConstraintViolation
    //  * @public 
    //  */
    // static checkDescription(description) {
    //     try {
    //         NonEmptyString.validateWithInterval(description, 0, 500, "Shelter.description");
    //         return "";
    //     }
    //     catch (error) {
    //         console.log(error);
    //         return "The shelter's description is to long!";
    //     }
    // }
    // // *** pets ****************************************************************
    // /** @returns the pets assigned to this shelter */
    // get pets() {
    //     return this._pets.value;
    // }
    // // TODO: sets, add and checks
    // // *** messages ************************************************************
    // /** @returns the messages the shelter received */
    // get messages() {
    //     return this._messages.value;
    // }
    // TODO: sets, add and checks
    // *** serialization ********************************************************
    /**
     * a static function that creates a `new Shelter` from a serialized one.
     * @returns a new `Shelter` with the corresponding slots if they pass their constraints. `null` otherwise.
     */
    static deserialize(slots: ShelterSlots) {
        // TODO
        let shelter = null;
        try {
            shelter = new Shelter({
                id: slots.id,
                name: slots.name,
                address: slots.address,
                phone: slots.phone,
                email: slots.email,
                officeHours: slots.officeHours,
                description: slots.description,
                // pets: slots.pets,
                // messages: slots.messages
            });
        }
        catch (e) {
            console.warn(`${e.constructor.name} while deserializing a shelter: ${e.message}`);
            shelter = null;
        }
        return shelter;
    }
    /**
     * this function is invoked by `JSON.stringify()` and converts the inner `"_propertyKey"` to `"propertyKey"`
     */
    toJSON() {
        // TODO: not complete
        return {id: this.id, name: this.name};
    }
    /** @returns the stringified Pet */
    toString() {
        // TODO: improve
        // return `Shelter{ id: ${this.id}, name: ${this.name}, address: ${this.address}, phone: ${this.phone}, email: ${this.email}, officeHours: ${this.officeHours}, description: ${this.description}, pets: ${this.pets}, messages:${this.messages} }`;
        return `Shelter{ id: ${this.id}, name: ${this.name}, address: ${this.address}, phone: ${this.phone}, email: ${this.email} }`;
    }
}