/**
 * @author Max Bergmann
 */
import { Entity, EntitySlots } from "../../lib/Entity.js";
import { catchValidation } from "../../lib/newUtil.js";
import {
  Address,
  AddressSlots,
} from "../../lib/valueObjects/composed/Address.js";
import { EmailAddress } from "../../lib/valueObjects/composed/EmailAddress.js";
import {
  OfficeHours,
  OHSlots,
} from "../../lib/valueObjects/composed/OfficeHours.js";
import { PhoneNumber } from "../../lib/valueObjects/composed/PhoneNumber.js";
import {
  NonEmptyString,
  NonEmptyStringOptions,
} from "../../lib/valueObjects/NonEmptyString.js";
import {
  OptionalString,
  OptionalStringOptions,
} from "../../lib/valueObjects/OptionalString.js";
import { PositiveNumberOptions } from "../../lib/valueObjects/PositiveNumber.js";
import { ShelterStorage } from "./ShelterStorage.js";

export interface ShelterSlots extends EntitySlots {
  name: string;
  address: AddressSlots;
  phone: string;
  email: string;
  officeHours: OHSlots;
  description?: string;
  creatorId: string;
}

const NAME_CONSTRAINTS: NonEmptyStringOptions = {
  name: "Shelter.name",
  max: 120,
};
const STREET_CONSTRAINTS: NonEmptyStringOptions = {
  name: "Shelter.street",
  max: 120,
};
const CITY_CONSTRAINTS: NonEmptyStringOptions = {
  name: "Shelter.city",
  max: 120,
};
const PHONE_CONSTRAINTS: NonEmptyStringOptions = { name: "Shelter.phone" };
const EMAIL_CONSTRAINTS: NonEmptyStringOptions = { name: "Shelter.email" };
const DESCRIPTION_CONSTRAINT: OptionalStringOptions = {
  name: "Shelter.description",
  max: 500,
};
const OFFICEHOURS_CONSTRAINT: NonEmptyStringOptions = {
  name: "Shelter.officeHours",
  max: 500,
};
const NUMBER_CONSTRAINTS: PositiveNumberOptions = {
  name: "Address.number",
  max: 10000,
};

export class Shelter extends Entity<ShelterSlots> {
  /** the name of the shelter
   * - requires NonEmptyString(120)
   */
  private _name: NonEmptyString;
  /** the address of the shelter
   * - requires AddressFormat(street, number, city)
   */
  private _address: Address;
  /** the phone number of the shelter
   * - requires NonEmptyString(30)
   * - requires matching regex = /^\+(?:[0-9] ?){6,14}[0-9]$/
   */
  private _phone: PhoneNumber;
  /** the email address of the shelter
   * - requires EmailFormat
   */
  private _email: EmailAddress;
  /** the office hours of the shelter
   * TODO: requirement
   */
  private _officeHours: OfficeHours;
  /**
   * optional description of the shelter (max. 500 letters)
   */
  private _description: OptionalString;

  private _creatorId: NonEmptyString;
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
    this._officeHours = new OfficeHours(slots.officeHours);
    if (slots.description) {
      this._description = OptionalString.create(slots.description);
    } else {
      this._description = OptionalString.create("-", DESCRIPTION_CONSTRAINT);
    }
    this._creatorId = NonEmptyString.create(slots.creatorId);
  }

  /**
   * updates the matching properties for the given slots, if the are different. Afterwards the
   * slots that are different are returned.
   * @param slots to update on this shelter
   * @returns the updated slots (that are different)
   */
  update(slots: ShelterSlots): Partial<ShelterSlots> {
    const updateSlots: Partial<ShelterSlots> = {};
    // update name
    if (!this._name.equals(slots.name)) {
      this.name = slots.name;
      updateSlots.name = slots.name;
    }
    // update address
    if (this._address.city !== slots.address.city) {
      this.address.city = slots.address.city;
      updateSlots.address = slots.address;
    }
    if (this._address.street !== slots.address.street) {
      this.address.street = slots.address.street;
      updateSlots.address = slots.address;
    }
    if (this._address.number !== slots.address.number) {
      this.address.number = slots.address.number;
      updateSlots.address = slots.address;
    }
    // update phone
    if (!this._phone.equals(slots.phone)) {
      this.phone = slots.phone;
      updateSlots.phone = slots.phone;
    }
    // update email
    if (!this._email.equals(slots.email)) {
      this.email = slots.email;
      updateSlots.email = slots.email;
    }
    // update office hours
    if (!this._officeHours.equals(slots.officeHours)) {
      this.officeHours.times = slots.officeHours;
      updateSlots.officeHours = slots.officeHours;
    }
    // update description (optional value)
    if (slots.description) {
      const test: OptionalString = OptionalString.create(slots.description);
      if (!this._description.equals(test)) {
        this.description = slots.description;
        updateSlots.description = slots.description;
      }
    } else {
      if (this.description !== "-") {
        this.description = "-";
        updateSlots.description = "-";
      }
    }
    // TODO update additional attributes

    return updateSlots;
  }

  // *** creatorId ***********************************************************
  get creatorId(): string {
    return this._creatorId.value;
  }
  set creatorId(creatorId: string) {
    this._creatorId = NonEmptyString.create(creatorId);
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
    return catchValidation(
      () => NonEmptyString.validate(name, NAME_CONSTRAINTS),
      "The shelter's name must not be empty or larger than 120 letters!"
    );
  }
  // *** address *************************************************************
  /** @returns the address of the shelter */
  get address(): Address {
    return this._address;
  }
  /** @param address - the address of the shelter to be set */
  set address(address: Address) {
    this._address = new Address(address);
  }
  /**
   * checks if the given shelter address is given and consists of street, number and city
   * @param address
   * @returns ConstraintViolation
   * @public
   */
  static checkAddress(address: Address) {
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
    return catchValidation(
      () => PhoneNumber.validate(phone, PHONE_CONSTRAINTS),
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
    return catchValidation(
      () => EmailAddress.validate(email, EMAIL_CONSTRAINTS),
      "The shelter's email address is not legit!"
    );
  }
  //*** officeHours *********************************************************
  /** @returns office hours of this shelter */
  get officeHours(): OfficeHours {
    return this._officeHours;
  }
  /** @param officeHours - officeHours of the shelter to set */
  set officeHours(officeHours: OfficeHours) {
    this._officeHours.times = officeHours.times;
  }
  /**
   * checks if the officeHours are given and matching the constraints
   * @param officeHours (string)
   * @returns ConstraintViolation
   * @public
   */
  static checkOfficeHours(officeHours: OHSlots) {
    return catchValidation(
      () => OfficeHours.checkTimes(officeHours),
      "You did not give every time opening and closing time together!"
    );
  }
  // *** description *********************************************************
  /** @returns the description of this shelter */
  get description(): string {
    return this._description.value;
  }
  /** @param description - of the shelter */
  set description(description) {
    this._description = OptionalString.create(
      description,
      DESCRIPTION_CONSTRAINT
    );
  }
  /**
   * checks if the given description is not to long (max. 500 letters)
   * @param description
   * @returns ConstraintViolation
   * @public
   */
  static checkDescription(description: string) {
    try {
      OptionalString.validate(description, DESCRIPTION_CONSTRAINT);
      return "";
    } catch (error) {
      console.error(error);
      return "The shelter's description is to long!";
    }
  }

  // *** serialization ********************************************************
  /**
   * this function is invoked by `JSON.stringify()` and converts the inner `"_propertyKey"` to `"propertyKey"`
   */
  toJSON(): ShelterSlots {
    return {
      id: this.id,
      name: this.name,
      address: this.address,
      email: this.email,
      officeHours: this.officeHours.times,
      phone: this.phone,
      description: this.description,
      creatorId: this.creatorId,
    };
  }
  /** @returns the stringified Pet */
  toString() {
    return `Shelter{ id: ${this.id}, name: ${
      this.name
    }, address: {${this.address.toString()}}, phone: ${this.phone}, email: ${
      this.email
    }, description: ${
      this.description
    }, officeHours: ${this.officeHours.toString()}, creatorId: ${
      this.creatorId
    } }`;
  }
}
