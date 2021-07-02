/**
 * @author Christian Prinz
 */
import {FormFactory} from "../lib/FormFactory.js";
import {HousingEnum, Pet, PetSlots, SexEnum, SizeEnum, SpeciesEnum, SuitableWithEnum} from "../m/Pet.js";
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
    sex: formFactory.createRangeSelection("sex", Pet.checkSex, SexEnum),
    size: formFactory.createRangeSelection("size", Pet.checkSize, SizeEnum),
    birthDate: formFactory.createInput("birthDate", Pet.checkBirthDate),
    vaccinationStatus: formFactory.createInput("vaccinationStatus", Pet.checkVaccinationStatus),
    compatibleWith: formFactory.createChoiceWidget('compatibleWith', Pet.checkCompatibleWith, 'checkbox', SpeciesEnum, []),
    suitableWith: formFactory.createChoiceWidget('suitableWith', Pet.checkSuitableWith, 'checkbox', SuitableWithEnum, []),
    housing: formFactory.createRangeSelection("housing", Pet.checkHousing, HousingEnum),
    isAdopted: formFactory.createOutput('isAdopted'),
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
