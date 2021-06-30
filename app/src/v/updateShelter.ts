/**
 * @author Max Bergmann
 */
import {FormFactory} from "../lib/FormFactory.js";
import {PetStorage} from "../m/PetStorage.js";
import { Shelter, ShelterSlots } from "../m/Shelter.js";
import {ShelterStorage} from "../m/ShelterStorage.js";


await ShelterStorage.retrieveAll();
await PetStorage.retrieveAll();

// we use the factory to create the view logic for the Form
const formFactory = new FormFactory("Shelter");

const formElements = {
  id: formFactory.createOutput("shelterId"),
  name: formFactory.createInput("shelterName", Shelter.checkName),
  street: formFactory.createInput("AddressStreet", Shelter.checkStreet),
  number: formFactory.createInput("AddressNumber", Shelter.checkNumber),
  city: formFactory.createInput("AddressCity", Shelter.checkCity),
  phone: formFactory.createInput("shelterPhone", Shelter.checkPhone),
  email: formFactory.createInput("shelterEmail", Shelter.checkEmail),
  officeHours: formFactory.createInput("shelterOfficeHours", Shelter.checkOfficeHours),
  description: formFactory.createInput("shelterDescription", Shelter.checkDescription),
};

const entitySelection = formFactory.createEntitySelection<ShelterSlots, Shelter>(
  'shelterSelection',
  ShelterStorage.instances,
  'name',
  formElements,
);

formFactory.createSubmitButton<ShelterSlots, Shelter>(
  'saveButton',
  formElements,
  (slots) => ShelterStorage.update(slots),
  entitySelection,
  'name',
);