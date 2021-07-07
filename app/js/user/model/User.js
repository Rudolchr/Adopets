import { Entity } from "../../lib/Entity.js";
import { catchValidation, catchValidations } from "../../lib/newUtil.js";
import { EmailAddress } from "../../lib/valueObjects/composed/EmailAddress.js";
import { IdReference } from "../../lib/valueObjects/composed/IdReference.js";
import { listEquals } from "../../lib/valueObjects/ValueObject.js";
import { PetStorage } from "../../pets/model/PetStorage.js";
import { ShelterStorage } from "../../shelters/model/ShelterStorage.js";
import { UserStorage } from "./UserStorage.js";
const EMAIL_CONSTRAINTS = { name: "User.email" };
const SHELTERS_CONSTRAINTS = { name: "User.shelters", foreignStorage: ShelterStorage };
const PETS_CONSTRAINTS = { name: "User.pets", foreignStorage: PetStorage };
export class User extends Entity {
    _email;
    _shelters;
    _pets;
    constructor(slots) {
        super(UserStorage, slots.id);
        this._email = EmailAddress.create(slots.email, EMAIL_CONSTRAINTS);
        this._shelters = IdReference.fromList(slots.shelters, SHELTERS_CONSTRAINTS);
        this._pets = IdReference.fromList(slots.pets, PETS_CONSTRAINTS);
    }
    /**
     * updates the matching properties for the given slots, if the are different. Afterwards the
     * slots that are different are returned.
     * @param slots to update on this user
     * @returns the updated slots (that are different)
     */
    update(slots) {
        const updateSlots = {};
        // update email
        if (!this._email.equals(slots.email)) {
            this.email = slots.email;
            updateSlots.email = slots.email;
        }
        // update suitableWith
        if (!listEquals(this._shelters, slots.shelters)) {
            this.shelters = slots.shelters;
            updateSlots.shelters = slots.shelters;
        }
        return updateSlots;
    }
    // *** email ***************************************************************
    /** @returns the shelters email address */
    get email() {
        return this._email.value;
    }
    /** @param email - email address of shelter to set */
    set email(email) {
        this._email = EmailAddress.create(email, EMAIL_CONSTRAINTS);
    }
    /**
     * checks if the given email address is legit ([number,letters,sybols]@[letters].[letters])
     * @param email
     * @returns Constraint Violation
     * @public
     */
    static checkEmail(email) {
        return catchValidation(() => EmailAddress.validate(email, EMAIL_CONSTRAINTS), "The shelter's email address is not legit!");
    }
    // *** shelters ***************************************************************
    /** @returns the users related shelters (shelters that got created by him) */
    get shelters() {
        return IdReference.toList(this._shelters);
    }
    /** @param shelters - the list of shelters to set for user */
    set shelters(shelters) {
        this._shelters = IdReference.fromList(shelters, SHELTERS_CONSTRAINTS);
    }
    addShelter(shelterId) {
        try {
            IdReference.validate(shelterId, SHELTERS_CONSTRAINTS);
            let key = String(shelterId);
            this._shelters.push(IdReference.create(ShelterStorage.instances[key].id, SHELTERS_CONSTRAINTS));
        }
        catch (e) {
            console.error(e);
        }
        console.log("dhfsöfdhjn");
    }
    removeShelter(shelterId) {
        try {
            IdReference.validate(shelterId, SHELTERS_CONSTRAINTS);
            for (var i = 0; i < this._shelters.length; i++) {
                if (this._shelters[i].equals(IdReference.create(shelterId, SHELTERS_CONSTRAINTS))) {
                    this._shelters.splice(i, 1);
                }
            }
        }
        catch (e) {
            console.error(e);
        }
    }
    /**
     * checks if all shelter ID Refs in list are legit
     * @param shelters
     * @returns  Constraint Violation
     * @public
     */
    static checkShelters(shelters) {
        return catchValidations(shelters, (value) => IdReference.validate(value, SHELTERS_CONSTRAINTS), "The related Shelters must exist!");
    }
    // *** pets *******************************************************************
    /** @returns the pets the user created */
    get pets() {
        return IdReference.toList(this._pets);
    }
    /** @param pets - the pets to set for this user */
    set pets(pets) {
        this._pets = IdReference.fromList(pets, PETS_CONSTRAINTS);
    }
    /**
     * checks if all pet ID refs in list are legit
     * @param pets
     * @returns Constraint Violation
     * @public
     */
    static checkPets(pets) {
        return catchValidations(pets, (value) => IdReference.validate(value, PETS_CONSTRAINTS), "The related Pets must exist!");
    }
    // *** serialization ********************************************************
    /**
     * this function is invoked by `JSON.stringify()` and converts the inner `"_propertyKey"` to `"propertyKey"`
     * @override the inherited toJSON()
     */
    toJSON() {
        return { id: this.id, email: this.email, shelters: this.shelters, pets: this.pets };
    }
    /** @returns the stringified user */
    toString() {
        return `User{ id: ${this.id}, email: ${this.email}, shelters: ${this.shelters}, pets: ${this.pets} }`;
    }
}
//# sourceMappingURL=User.js.map