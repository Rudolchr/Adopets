/**
 * @author Christian Prinz
 */
import { FormFactory } from "../../lib/forms/FormFactory.js";
import { ShelterStorage } from "../../shelters/model/ShelterStorage.js";
import { HousingEnum, Pet, SexEnum, SizeEnum, SpeciesEnum, SuitableWithEnum } from "../model/Pet.js";
import { PetStorage } from "../model/PetStorage.js";
await ShelterStorage.retrieveAll();
await PetStorage.retrieveAll();
// we use the factory to create the view logic for the Form
const formFactory = new FormFactory("Pet");
let userSpecificStorage = PetStorage.instances;
if (auth.currentUser?.uid) {
    userSpecificStorage = PetStorage.retrieveAllFromUser(auth.currentUser?.uid);
}
// which elements should be manipulated with this Form
const formElements = {
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
    shelterId: formFactory.createReferenceSelection("shelter", Pet.checkShelterId, ShelterStorage.instances, 'name'), // TODO filter to accounts shelters only
};
// selection
let entitySelection = createSelection();
function createSelection() {
    return formFactory.createEntitySelection('petSelection', userSpecificStorage, // TODO filter to accounts shelters only
    'name', formElements, { value: '', text: '--- create a new pet ---' });
}
entitySelection.addEventListener('change', e => {
    const id = entitySelection.value;
    if (id !== undefined && id.length > 0) {
        deleteButton.hidden = false;
        submitButton.textContent = 'Update pet';
    }
    else {
        deleteButton.hidden = true;
        submitButton.textContent = 'Create pet';
    }
});
// submit button
const submitButton = formFactory.createSubmitButton('submitButton', formElements, onSubmit, entitySelection, 'name');
async function onSubmit(slots) {
    if (deleteButton.hidden) {
        // create a new pet
        const { id, ...addSlots } = slots;
        await PetStorage.add(addSlots);
        // TODO
        userSpecificStorage = PetStorage.instances;
        if (auth.currentUser?.uid) {
            userSpecificStorage = PetStorage.retrieveAllFromUser(auth.currentUser?.uid);
        }
        // add new pet to selection
        entitySelection = createSelection();
    }
    else {
        // update existing pet
        PetStorage.update(slots);
    }
}
// delete Button
const deleteButton = formFactory.form['deleteButton'];
deleteButton.hidden = true;
deleteButton.addEventListener("click", async () => {
    const id = entitySelection.value;
    if (id) {
        if (confirm("Do you really want to remove this pet?")) {
            await PetStorage.destroy(id);
            userSpecificStorage = PetStorage.instances;
            if (auth.currentUser?.uid) {
                userSpecificStorage = PetStorage.retrieveAllFromUser(auth.currentUser?.uid);
            }
            // update the form
            entitySelection = createSelection();
            deleteButton.hidden = true;
            submitButton.textContent = 'Create pet';
        }
    }
});
//# sourceMappingURL=editPets.js.map