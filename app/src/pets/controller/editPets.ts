/**
 * @author Christian Prinz
 */
import {FormElementBase, FormFactory} from "../../lib/forms/FormFactory.js";
import {ShelterStorage} from "../../shelters/model/ShelterStorage.js";
import {HousingEnum, Pet, PetSlots, SexEnum, SizeEnum, SpeciesEnum, SuitableWithEnum} from "../model/Pet.js";
import {PetStorage} from "../model/PetStorage.js";

await ShelterStorage.retrieveAll();
await PetStorage.retrieveAll();

let cancelSyncDBwithUI: any = null;

// we use the factory to create the view logic for the Form
const formFactory = new FormFactory("Pet");

let userPets = PetStorage.instances;
if (auth.currentUser?.uid) {
  userPets = PetStorage.getUserPets(auth.currentUser?.uid);
}
let userShelters = ShelterStorage.instances;
if (auth.currentUser?.uid) {
  userShelters = ShelterStorage.getUserShelters(auth.currentUser?.uid);
}

// which elements should be manipulated with this Form
const formElements: Record<keyof PetSlots, FormElementBase> = {
  id: formFactory.createOutput("petId"),
  creatorId: formFactory.createOutput("creatorId"),
  name: formFactory.createInput("petName", Pet.checkName),
  species: formFactory.createRangeSelection("species", Pet.checkSpecies, SpeciesEnum),
  sex: formFactory.createRangeSelection("sex", Pet.checkSex, SexEnum),
  size: formFactory.createRangeSelection("size", Pet.checkSize, SizeEnum),
  birthDate: formFactory.createInput("birthDate", Pet.checkBirthDate),
  vaccinationStatus: formFactory.createInput("vaccinationStatus", Pet.checkVaccinationStatus),
  compatibleWith: formFactory.createChoiceWidget('compatibleWith', Pet.checkCompatibleWith, 'checkbox', SpeciesEnum, []),
  suitableWith: formFactory.createChoiceWidget('suitableWith', Pet.checkSuitableWith, 'checkbox', SuitableWithEnum, []),
  housing: formFactory.createRangeSelection("housing", Pet.checkHousing, HousingEnum),
  isAdopted: formFactory.createSingleCheckbox('isAdopted'),
  shelterId: formFactory.createReferenceSelection("shelter", Pet.checkShelterId, userShelters, 'name'),
};

// selection
let entitySelection = createSelection();

function createSelection() {
  return formFactory.createEntitySelection<PetSlots, Pet>(
    'petSelection',
    userPets,
    'name',
    formElements,
    {value: '', text: '--- create a new pet ---'}
  );
}
entitySelection.addEventListener('change', async () => {
  const id = entitySelection.value;

  cancelSyncDBwithUI = await PetStorage.syncDBwithUI(id);

  if (id !== undefined && id.length > 0) {
    deleteButton.hidden = false;
    submitButton.textContent = 'Update pet';
  } else {
    deleteButton.hidden = true;
    submitButton.textContent = 'Create pet';
  }
});

// submit button
const submitButton = formFactory.createSubmitButton<PetSlots, Pet>(
  'submitButton',
  formElements,
  onSubmit,
  entitySelection,
  'name',
);

async function onSubmit(slots: PetSlots) {
  if (deleteButton.hidden) {
    // create a new pet
    const {id, ...addSlots} = slots;
    await PetStorage.add(addSlots);
    // TODO
    userPets = PetStorage.instances;
    if (auth.currentUser?.uid) {
      userPets = PetStorage.getUserPets(auth.currentUser?.uid);
    }
    // add new pet to selection
    entitySelection = createSelection();
  } else {
    // update existing pet
    PetStorage.update(slots);
    deleteButton.hidden = true;
    submitButton.textContent = 'Create pet';
  }
}

// delete Button
const deleteButton: HTMLButtonElement = formFactory.form['deleteButton'];
deleteButton.hidden = true;
deleteButton.addEventListener("click", async () => {
  const id = entitySelection.value;
  if (id) {
    if (confirm("Do you really want to remove this pet?")) {
      await PetStorage.destroy(id);
      userPets = PetStorage.instances;
      if (auth.currentUser?.uid) {
        userPets = PetStorage.getUserPets(auth.currentUser?.uid);
      }
      // update the form
      entitySelection = createSelection();
      deleteButton.hidden = true;
      submitButton.textContent = 'Create pet';
    }
  }
});

window.addEventListener("beforeunload", () => {
  cancelSyncDBwithUI();
});