/**
 * @author Christian Prinz
 */
import { fillSelectWithEntities, fillSelectWithRange } from "../lib/newUtil.js";
import { Pet, SpeciesEnum } from "../m/Pet.js";
import { PetStorage } from "../m/PetStorage.js";
const form = document.forms.namedItem("Pet");
// load all pets
await PetStorage.retrieveAll();
/** ### Pet_ID ------------------------------------------------------------- */
const idOutput = form["petId"];
/** ### PET_NAME ----------------------------------------------------------- */
const petNameInput = form["petName"];
petNameInput.addEventListener("input", () => petNameInput.setCustomValidity(Pet.checkName(petNameInput.value)));
/** ### SPECIES ------------------------------------------------------------ */
const speciesSelection = form["species"];
speciesSelection.addEventListener("change", () => {
    speciesSelection.setCustomValidity(Pet.checkSpecies(speciesSelection.value));
});
/** ### BIRTH_DATE --------------------------------------------------------- */
const birthDateInput = form["birthDate"];
birthDateInput.addEventListener("input", () => {
    birthDateInput.setCustomValidity(Pet.checkBirthDate(birthDateInput.value));
});
/** ### PET_SELECTION ------------------------------------------------------ */
const petSelection = form['petSelection'];
fillSelectWithEntities(petSelection, PetStorage.instances, 'name');
// when a pet is selected, populate the form with its data
petSelection.addEventListener("change", () => {
    const petKey = petSelection.value;
    // fill the form with the pet's data
    if (petKey) {
        const pet = PetStorage.instances[petKey];
        idOutput.value = petKey;
        petNameInput.value = pet.name;
        fillSelectWithRange(speciesSelection, SpeciesEnum, [pet.species]);
        birthDateInput.valueAsDate = pet.birthDate;
    }
    else {
        form.reset();
    }
});
/*****************************************************************************
 * ### SAVE_BUTTON
 * - set an event handler for the save button
 * - neutralize form on submit
 */
const saveButton = form["saveButton"];
// event handler for save button
saveButton.addEventListener("click", () => {
    // set error messages in case of constraint violations
    petNameInput.setCustomValidity(Pet.checkName(petSelection.value));
    speciesSelection.setCustomValidity(Pet.checkSpecies(speciesSelection.value));
    birthDateInput.setCustomValidity(Pet.checkBirthDate(birthDateInput.value));
    // show possible errors
    form.reportValidity();
    // save the input date only if all of the form fields are valid
    if (form.checkValidity()) {
        PetStorage.update({
            id: petSelection.value,
            name: petNameInput.value,
            species: speciesSelection.value,
            birthDate: birthDateInput.value,
        });
        // update the selection list option element
        petSelection.options[petSelection.selectedIndex].text = petNameInput.value;
    }
});
// neutralize the submit event
form.addEventListener("submit", (e) => {
    e.preventDefault();
    form.reset();
});
//# sourceMappingURL=updatePet.js.map