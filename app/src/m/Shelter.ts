/**
 * @author Max Bergmann
 */
import { Entity, EntitySlots } from "../lib/Entity.js";
import { NonEmptyString } from "../lib/valueObjects/NonEmptyString.js";
import { ShelterStorage } from "./ShelterStorage.js";

export interface ShelterSlots extends EntitySlots {
    name: string;
}

export class Shelter extends Entity{
    /** the name of the shelter
     * - requires NonEmptyString(120)
     */
    private _name: NonEmptyString;
    /** the address of the shelter
     * - requires AddressFormat(street, number, city) TODO
     */
    private _address;
    /** the phone number of the shelter 
     * - requires PhoneFormat(15 numbers) TODO
     */
    private _phone;
    /** the email address of the shelter
     * - requires EmailFormat TODO
     */
    private _email;
    /** the office hours of the shelter
     * TODO: requirement
     */
    private _officeHours;
    /**
     * optional description of the shelter (max. 500 letters)
     */
    private _description;
    /** 
     * list of pett IDs of pets assigned to this shelter
     */
    private _pets;
    /**
     * list of contact messages TODO
     */
    private _messages;

    constructor(slots: ShelterSlots) {
        super(ShelterStorage, slots.id);
        this._name = NonEmptyString.create(slots.name, {
            name: "Shelter.name",
            min: 0,
            max: 120,
        });
        // TODO: set the shelter attributes from slots with given helper functions
    }

    // *** name ****************************************************************
    /** @returns the name of the shelter */
    get name() {
        return this._name.value;
    }
    /** @param name - the name of shelter to be set */
    set name(name) {
        this._name = NonEmptyString.create(name);
    }
    /**
     * checks if the given name is not empty and has a maximum of 120 letters
     * @param name 
     * @returns ConstraintViolation
     * @public
     */
    static checkName(name) {
        try {
            NonEmptyString.validateWithInterval(name, 1, 120, "Shelter.name");
            return "";
        }
        catch (error) {
            console.error(error);
            return "The shelter's name must not be empty or larger than 120 letters!";
        }
    }
    // *** address *************************************************************
    /** @returns the address of the shelter */
    get address() {
        return this._address.value;
    }
    /** @param address - the address of the shelter to be set */
    set address(address) {
        // TODO: use someting else instead of NonEmptyString
        this._address = NonEmptyString.create(address);
    }
    /**
     * checks if the given shelter address is given and consists of street, number and city
     * @param address 
     * @returns ConstraintViolation
     * @public
     */
    static checkAddress(address) {
        try {
            // TODO: use something else NonEmptyString
            NonEmptyString.validateWithInterval(address, 0, 120, "Shelter.address");
            return "";
        }
        catch (error) {
            console.error(error);
            return "The shelters address is not in the given format!";
        }
    }
    // *** phone ***************************************************************
    /** @returns phone number of this shelter */
    get phone() {
        return this._phone.value;
    }
    /** @param phone - the phone number of shelter to be set */
    set phone(phone) {
        // TODO: replace NonEmptyString by something else
        this._phone = NonEmptyString.create(phone);
    }
    /**
     * checks if the given phone number is given and consists of maximum 15 numbers and only numbers
     * @param phone
     * @returns Constraint Violation
     * @public
     */
    static checkPhone(phone) {
        try {
            // TODO: replace NonEmptyString by something else
            NonEmptyString.validateWithInterval(phone, 1, 120, "Shelter.phone");
            return "";
        }
        catch (error) {
            console.error(error);
            return "The shelters phone number is not in given Format (only numbers and max. 15)!";
        }
    }
    // *** email ***************************************************************
    /** @returns the shelters email address */
    get email() {
        return this._email.value;
    }
    /** @param email - email address of shelter to set */
    set email(email) {
        // TODO: replace NonEmptyString by something else
        this._email = NonEmptyString.create(email);
    }
    /**
     * checks if the given email address is legit ([number,letters,sybols]@[letters].[letters])
     * @param email  
     * @returns Constraint Violation
     * @public
     */
    static checkEmail(email) {
        try {
            // TODO: replace NonEmptyString by something else
            NonEmptyString.validateWithInterval(email, 1, 120, "Shelter.email");
            return "";
        }
        catch (error) {
            console.error(error);
            return "The shelter's email address is not legit!"
        }
    }
    // *** officeHours *********************************************************
    /** @returns office hours of this shelter */
    get officeHours() {
        return this._officeHours.value;
    }
    /** @param officeHours - officeHours of the shelter to set */
    set officeHours(officeHours) {
        // TODO: replace NonEmptyString by something else
        this._officeHours = NonEmptyString.create(officeHours);
    }
    /**
     * checks if the officeHours are given and matching teh constraints (TODO)
     * @param officeHours 
     * @returns ConstraintViolation
     * @public 
     */
    static checkOfficeHours(officeHours) {
        try {
            // TODO: replace NonEmptyString by something else
            NonEmptyString.validateWithInterval(officeHours, 1, 120, "Shelter.officeHours");
            return "";
        }
        catch (error) {
            console.error(error);
            return "The shelter's office hours are not matching the constraints!";
        }
    }
    // *** description *********************************************************
    /** @returns the description of this shelter */
    get description() {
        return this._description.value;
    }
    /** @param description - of the shelter */
    set description(description) {
        this._description = NonEmptyString.create(description);
    }
    /**
     * checks if the given description is not to long (max. 500 letters)
     * @param description 
     * @returns ConstraintViolation
     * @public 
     */
    static checkDescription(description) {
        try {
            NonEmptyString.validateWithInterval(description, 0, 500, "Shelter.description");
            return "";
        }
        catch (error) {
            console.log(error);
            return "The shelter's description is to long!";
        }
    }
    // *** pets ****************************************************************
    /** @returns the pets assigned to this shelter */
    get pets() {
        return this._pets.value;
    }
    // TODO: sets, add and checks
    // *** messages ************************************************************
    /** @returns the messages the shelter received */
    get messages() {
        return this._messages.value;
    }
    // TODO: sets, add and checks
    // *** serialization ********************************************************
    /**
     * a static function that creates a `new Shelter` from a serialized one.
     * @returns a new `Shelter` with the corresponding slots if they pass their constraints. `null` otherwise.
     */
    static deserialize(slots) {
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
                pets: slots.pets,
                messages: slots.messages
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
        return { id: this.id, name: this.name };
    }
    /** @returns the stringified Pet */
    toString() {
        // TODO: improve
        return `Shelter{ id: ${this.id}, name: ${this.name}, address: ${this.address}, phone: ${this.phone}, email: ${this.email}, officeHours: ${this.officeHours}, description: ${this.description}, pets: ${this.pets}, messages:${this.messages} }`;
    }
}