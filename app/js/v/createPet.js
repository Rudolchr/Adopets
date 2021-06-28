/**
 * @author Christian Prinz
 */
import { fillSelectWithEntities, fillSelectWithRange } from "../lib/newUtil.js";
import { Pet, SpeciesEnum } from "../m/Pet.js";
import { PetStorage } from "../m/PetStorage.js";
import { ShelterStorage } from "../m/ShelterStorage.js";
const form = document.forms.namedItem("Pet");
// load all pets
await ShelterStorage.retrieveAll();
await PetStorage.retrieveAll();
/** ### PET_NAME ----------------------------------------------------------- */
const petNameInput = form["petName"];
petNameInput.addEventListener("input", () => petNameInput.setCustomValidity(Pet.checkName(petNameInput.value)));
/** ### SPECIES ------------------------------------------------------------ */
const speciesSelection = form["species"];
fillSelectWithRange(speciesSelection, SpeciesEnum);
speciesSelection.addEventListener("change", () => {
    speciesSelection.setCustomValidity(Pet.checkSpecies(speciesSelection.value));
});
/** ### BIRTH_DATE ------------------------------------------------------- */
const birthDateInput = form["birthDate"];
birthDateInput.addEventListener("input", () => {
    birthDateInput.setCustomValidity(Pet.checkBirthDate(birthDateInput.value));
});
/** ### SHELTER ------------------------------------------------------------ */
const shelterSelection = form["shelter"];
fillSelectWithEntities(shelterSelection, ShelterStorage.instances, 'name');
shelterSelection.addEventListener("change", () => {
    shelterSelection.setCustomValidity(Pet.checkShelterId(shelterSelection.value));
});
/** ### SAVE_BUTTON -------------------------------------------------------- */
const saveButton = form["addButton"];
saveButton.addEventListener("click", () => {
    // set error messages in case of constraint violations
    petNameInput.setCustomValidity(Pet.checkName(petNameInput.value));
    speciesSelection.setCustomValidity(Pet.checkSpecies(speciesSelection.value));
    birthDateInput.setCustomValidity(Pet.checkBirthDate(birthDateInput.value));
    shelterSelection.setCustomValidity(Pet.checkShelterId(shelterSelection.value));
    // show possible errors
    form.reportValidity();
    // save the input data only if all of the form fields are valid
    form.checkValidity() && PetStorage.add({
        name: petNameInput.value,
        species: speciesSelection.value,
        birthDate: birthDateInput.value,
        shelterId: shelterSelection.value,
    });
});
// neutralize the submit event
form.addEventListener("submit", (e) => {
    e.preventDefault();
    form.reset();
});
// Set a handler for the event when the browser window/tab is closed
//# sourceMappingURL=createPet.js.map