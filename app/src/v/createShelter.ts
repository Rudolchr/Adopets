/**
 * @author Max Bergmann
 */
import { FormFactory } from "../lib/FormFactory.js";
import { Address } from "../lib/valueObjects/composed/Address.js";
import { PetStorage } from "../m/PetStorage.js";
import { Shelter, ShelterSlots } from "../m/Shelter.js";
import { ShelterStorage } from "../m/ShelterStorage.js";

// load all
await ShelterStorage.retrieveAll();
await PetStorage.retrieveAll();

// we use the factory to create the view logic for the Form
const formFactory = new FormFactory("Shelter");

const formElements = {
  name: formFactory.createInput("shelterName", Shelter.checkName),
  street: formFactory.createInput("AddressStreet", Address.checkStreet),
  number: formFactory.createInput("AddressNumber", Address.checkNumber),
  city: formFactory.createInput("AddressCity", Address.checkCity),
  phone: formFactory.createInput("shelterPhone", Shelter.checkPhone),
  email: formFactory.createInput("shelterEmail", Shelter.checkEmail),
  officeHours: formFactory.createInput("shelterOfficeHours", Shelter.checkOfficeHours),
  description: formFactory.createInput("shelterDescription", Shelter.checkDescription),
};

formFactory.createSubmitButton<Omit<ShelterSlots, 'id'>, any>(
  'addButton',
  formElements,
  (slots) => ShelterStorage.add(slots),
);