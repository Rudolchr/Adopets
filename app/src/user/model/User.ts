import { Entity, EntitySlots } from "../../lib/Entity";
import { catchValidation, catchValidations } from "../../lib/newUtil";
import { EmailAddress } from "../../lib/valueObjects/composed/EmailAddress";
import { IdReference, IdReferenceOptions } from "../../lib/valueObjects/composed/IdReference";
import { NonEmptyStringOptions } from "../../lib/valueObjects/NonEmptyString";
import { listEquals } from "../../lib/valueObjects/ValueObject";
import { Pet, PetSlots } from "../../pets/model/Pet";
import { PetStorage } from "../../pets/model/PetStorage";
import { Shelter, ShelterSlots } from "../../shelters/model/Shelter";
import { ShelterStorage } from "../../shelters/model/ShelterStorage";
import { UserStorage } from "./UserStorage";

export interface UserSlots extends EntitySlots {
    email: string;
    shelters: string[];
    pets: string[];
}

const EMAIL_CONSTRAINTS: NonEmptyStringOptions = {name: "User.email"};
const SHELTERS_CONSTRAINTS: IdReferenceOptions<ShelterSlots, Shelter> = {name: "User.shelters", foreignStorage: ShelterStorage};
const PETS_CONSTRAINTS: IdReferenceOptions<PetSlots, Pet> = {name: "User.pets", foreignStorage: PetStorage};

export class User extends Entity<UserSlots> {

    private _email: EmailAddress;
    private _shelters: IdReference<Shelter>[];
    private _pets: IdReference<Pet>[];

    constructor(slots: UserSlots) {
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
    update(slots: UserSlots): Partial<UserSlots> {
        const updateSlots: Partial<UserSlots> = {};
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

    // *** shelters ***************************************************************
    /** @returns the users related shelters (shelters that got created by him) */
    get shelters(): string[] {
        return IdReference.toList(this._shelters);
    }
    /** @param shelters - the list of shelters to set for user */
    set shelters(shelters: string[]) {
        this._shelters = IdReference.fromList(shelters, SHELTERS_CONSTRAINTS);
    }
    /**
     * checks if all shelter ID Refs in list are legit
     * @param shelters 
     * @returns  Constraint Violation
     * @public
     */
    static checkShelters(shelters: string[]) {
        return catchValidations(shelters, (value) =>
            IdReference.validate(value, SHELTERS_CONSTRAINTS),
            "The related Shelters must exist!"
        );
    }
    // *** pets *******************************************************************
    /** @returns the pets the user created */
    get pets(): string[] {
        return IdReference.toList(this._pets);
    }
    /** @param pets - the pets to set for this user */
    set pets(pets: string[]) {
        this._pets = IdReference.fromList(pets, PETS_CONSTRAINTS);
    }
    /**
     * checks if all pet ID refs in list are legit
     * @param pets 
     * @returns Constraint Violation
     * @public
     */
    static checkPets(pets: string[]) {
        return catchValidations(pets, (value) =>
            IdReference.validate(value, PETS_CONSTRAINTS),
            "The related Pets must exist!"
        );
    }

    // *** serialization ********************************************************
    /**
     * this function is invoked by `JSON.stringify()` and converts the inner `"_propertyKey"` to `"propertyKey"`
     * @override the inherited toJSON()
     */
    toJSON(): UserSlots {
        return {id: this.id, email: this.email, shelters: this.shelters, pets: this.pets};
    }
    /** @returns the stringified user */
    toString() {
        return `User{ id: ${this.id}, email: ${this.email}, shelters: ${this.shelters}, pets: ${this.pets} }`;
    }

}