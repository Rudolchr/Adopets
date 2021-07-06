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
    isAdopted: formFactory.createSingleCheckbox('isAdopted'),
    shelterId: formFactory.createReferenceSelection("shelter", Pet.checkShelterId, ShelterStorage.instances, 'name'),
};
const entitySelection = formFactory.createEntitySelection('petSelection', PetStorage.instances, 'name', formElements);
formFactory.createSubmitButton('saveButton', formElements, (slots) => PetStorage.update(slots), entitySelection, 'name');
// Delete Button
entitySelection.addEventListener('change', e => {
    const id = entitySelection.value;
    console.log(id + ": " + typeof id);
    if (id !== undefined && id.length > 0) {
        deleteButton.disabled = false;
    }
    else {
        deleteButton.disabled = true;
    }
});
const deleteButton = formFactory.form['deleteButton'];
deleteButton.disabled = true;
deleteButton.addEventListener("click", () => {
    const id = entitySelection.value;
    if (id) {
        if (confirm("Do you really want to remove this pet?")) {
            PetStorage.destroy(id);
        }
        // remove deleted pet from selection
        entitySelection.remove(entitySelection.selectedIndex);
    }
});
//# sourceMappingURL=editPets.js.map