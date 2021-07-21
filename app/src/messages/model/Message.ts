import { Entity, EntitySlots } from "../../lib/Entity.js";
import { catchValidation } from "../../lib/newUtil.js";
import { EmailAddress } from "../../lib/valueObjects/composed/EmailAddress.js";
import {
  IdReference,
  IdReferenceOptions,
} from "../../lib/valueObjects/composed/IdReference.js";
import { PhoneNumber } from "../../lib/valueObjects/composed/PhoneNumber.js";
import {
  NonEmptyString,
  NonEmptyStringOptions,
} from "../../lib/valueObjects/NonEmptyString.js";
import { Pet, PetSlots } from "../../pets/model/Pet.js";
import { PetStorage } from "../../pets/model/PetStorage.js";
import { Shelter, ShelterSlots } from "../../shelters/model/Shelter.js";
import { ShelterStorage } from "../../shelters/model/ShelterStorage.js";
import { MessageStorage } from "./MessageStorage.js";

export interface MessageSlots extends EntitySlots {
  message: string;
  shelterId: string;
  petId?: string;
  senderEmail?: string;
  senderPhoneNo?: string;
}

const MESSAGE_CONSTRAINTS: NonEmptyStringOptions = {
  name: "Message.message",
  max: 500,
};
const SHELTER_ID_CONSTRAINTS: IdReferenceOptions<ShelterSlots, Shelter> = {
  name: "Message.shelterId",
  foreignStorage: ShelterStorage,
};
const PET_ID_CONSTRAINTS: IdReferenceOptions<PetSlots, Pet> = {
  name: "Message.shelterId",
  foreignStorage: PetStorage,
};
const SENDER_EMAIL_CONSTRAINTS: NonEmptyStringOptions = {
  name: "Message.senderEmail",
};
const SENDER_PHONE_NO_CONSTRAINTS: NonEmptyStringOptions = {
  name: "Message.senderPhoneNo",
};

export class Message extends Entity<MessageSlots> {
  private _message: NonEmptyString;
  private _shelterId: IdReference<Shelter>;
  private _petId?: IdReference<Pet>;
  private _senderEmail?: EmailAddress;
  private _senderPhoneNo?: PhoneNumber;

  constructor(slots: MessageSlots) {
    super(MessageStorage, slots.id);
    this._message = NonEmptyString.create(slots.message, MESSAGE_CONSTRAINTS);
    this._shelterId = IdReference.create(
      slots.shelterId,
      SHELTER_ID_CONSTRAINTS
    );
    this._petId = slots.petId
      ? IdReference.create(slots.petId, PET_ID_CONSTRAINTS)
      : undefined;
    this._senderEmail = slots.senderEmail
      ? EmailAddress.create(slots.senderEmail, SENDER_EMAIL_CONSTRAINTS)
      : undefined;
    this._senderPhoneNo = slots.senderPhoneNo
      ? PhoneNumber.create(slots.senderPhoneNo, SENDER_PHONE_NO_CONSTRAINTS)
      : undefined;
  }

  // *** UPDATE *************************************************************

  public update(slots: MessageSlots) {
    const updateSlots: Partial<MessageSlots> = {};
    // update message
    if (!this._message.equals(slots.message)) {
      this.message = slots.message;
      updateSlots.message = slots.message;
    }
    // update shelterId
    if (!this._shelterId.equals(slots.shelterId)) {
      this.shelterId = slots.shelterId;
      updateSlots.shelterId = slots.shelterId;
    }
    // update petId
    if (
      (!this._petId && slots.petId) ||
      (this._petId && !slots.petId) ||
      (this._petId && slots.petId && !this._petId.equals(slots.petId))
    ) {
      this.petId = slots.petId;
      updateSlots.petId = slots.petId;
    }
    // update senderEmail
    if (
      (!this._senderEmail && slots.senderEmail) ||
      (this._senderEmail && !slots.senderEmail) ||
      (this._senderEmail &&
        slots.senderEmail &&
        !this._senderEmail.equals(slots.senderEmail))
    ) {
      this.senderEmail = slots.senderEmail;
      updateSlots.senderEmail = slots.senderEmail;
    }
    // update senderPhoneNo
    if (
      (!this._senderPhoneNo && slots.senderPhoneNo) ||
      (this._senderPhoneNo && !slots.senderPhoneNo) ||
      (this._senderPhoneNo &&
        slots.senderPhoneNo &&
        !this._senderPhoneNo.equals(slots.senderPhoneNo))
    ) {
      this.senderPhoneNo = slots.senderPhoneNo;
      updateSlots.senderPhoneNo = slots.senderPhoneNo;
    }

    return updateSlots;
  }

  // *** message ************************************************************
  public get message(): string {
    return this._message.value;
  }
  static checkMessage(message: string) {
    return catchValidation(
      () => NonEmptyString.validate(message, MESSAGE_CONSTRAINTS),
      "The message's message must not be empty or larger than 500 letters!"
    );
  }
  public set message(value: string) {
    this._message = NonEmptyString.create(value, MESSAGE_CONSTRAINTS);
  }

  // *** shelterId **********************************************************

  /** @returns the shelterId of the pet */
  get shelterId(): string {
    return this._shelterId.value;
  }

  /**
   * checks if the given shelterId is valid
   * @param shelterId
   * @returns a ConstraintViolation
   * @public
   */
  static checkShelterId(shelterId: string) {
    return catchValidation(
      () => IdReference.validate(shelterId, SHELTER_ID_CONSTRAINTS),
      "The message's shelter does not exist!"
    );
  }

  /** @param shelterId - the new shelterId to set */
  set shelterId(shelterId: string) {
    this._shelterId = IdReference.create(shelterId, SHELTER_ID_CONSTRAINTS);
  }

  // *** petId **********************************************************

  /** @returns the petId of the message */
  get petId(): string | undefined {
    return this._petId?.value;
  }

  /**
   * checks if the given petId is valid
   * @param petId
   * @returns a ConstraintViolation
   * @public
   */
  static checkPetId(petId: string | undefined) {
    return petId
      ? catchValidation(
          () => IdReference.validate(petId, PET_ID_CONSTRAINTS),
          "The message's pet does not exist!"
        )
      : "";
  }

  /** @param petId - the new petId to set */
  set petId(petId: string | undefined) {
    this._petId = petId
      ? IdReference.create(petId, PET_ID_CONSTRAINTS)
      : undefined;
  }

  // *** senderEmail **********************************************************

  /** @returns the senderEmail of the message */
  get senderEmail(): string | undefined {
    return this._senderEmail?.value;
  }

  /**
   * checks if the given senderEmail is valid
   * @param senderEmail
   * @returns a ConstraintViolation
   * @public
   */
  static checkSenderEmail(senderEmail: string | undefined) {
    return senderEmail
      ? catchValidation(
          () => EmailAddress.validate(senderEmail, SENDER_EMAIL_CONSTRAINTS),
          "The message's email address is not legit!"
        )
      : "";
  }

  /** @param senderEmail - the new senderEmail to set */
  set senderEmail(senderEmail: string | undefined) {
    this._senderEmail = senderEmail
      ? EmailAddress.create(senderEmail, SENDER_EMAIL_CONSTRAINTS)
      : undefined;
  }

  // *** senderPhoneNo **********************************************************

  /** @returns the senderPhoneNo of the message */
  get senderPhoneNo(): string | undefined {
    return this._senderPhoneNo?.value;
  }

  /**
   * checks if the given senderPhoneNo is valid
   * @param senderPhoneNo
   * @returns a ConstraintViolation
   * @public
   */
  static checkSenderPhoneNo(senderPhoneNo: string | undefined) {
    return senderPhoneNo
      ? catchValidation(
          () =>
            PhoneNumber.validate(senderPhoneNo, SENDER_PHONE_NO_CONSTRAINTS),
          "The message's phone number is not given or nor in given Format!"
        )
      : "";
  }

  /** @param senderPhoneNo - the new senderPhoneNo to set */
  set senderPhoneNo(senderPhoneNo: string | undefined) {
    this._senderPhoneNo = senderPhoneNo
      ? PhoneNumber.create(senderPhoneNo, SENDER_PHONE_NO_CONSTRAINTS)
      : undefined;
  }

  toJSON(): MessageSlots {
    return {
      ...this,
    };
  }
  /** @returns the stringified Pet */
  toString() {
    return `Message{ ${JSON.stringify(this)} }`;
  }
}
