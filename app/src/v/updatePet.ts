/**
 * @author Christian Prinz
 */
import {FormFactory} from "../lib/FormFactory.js";
import {Pet, PetSlots, SpeciesEnum} from "../m/Pet.js";
import {PetStorage} from "../m/PetStorage.js";
import {ShelterStorage} from "../m/ShelterStorage.js";


await ShelterStorage.retrieveAll();
await PetStorage.retrieveAll();

// we use the factory to create the view logic for the Form
const formFactory = new FormFactory("Pet");

// which elements should be manipulated with this Form
const formElements = {
    id: formFactory.createOutput("petId"),
    name: formFactory.createInput("petName", Pet.checkName),
    species: formFactory.createRangeSelection("species", Pet.checkSpecies, SpeciesEnum),
    birthDate: formFactory.createInput("birthDate", Pet.checkBirthDate),
    shelterId: formFactory.createReferenceSelection("shelter", Pet.checkShelterId, ShelterStorage.instances, 'name'),
  }
  
const entitySelection = formFactory.createEntitySelection<PetSlots, Pet>(
  'petSelection',
  PetStorage.instances,
  'name',
  formElements,
);

formFactory.createSubmitButton<PetSlots, Pet>(
  'saveButton',
  formElements,
  (slots) => PetStorage.update(slots),
  entitySelection,
  'name',
);