/**
 * @author Christian Prinz
 */
import { fillSelectWithOptions } from "../lib/util.js";
import { Pet } from "../m/Pet.js";
import { PetStorage } from "../m/PetStorage.js";
const form = document.forms.namedItem("Pet");
// load all pets
await PetStorage.retrieveAll();
/*****************************************************************************
 * ### Pet_ID
 * Though there is no check needed
 */
const idOutput = form["petId"];
/*****************************************************************************
 * ### NAME
 * - responsive validation
 */
const nameInput = form["petName"];
nameInput.addEventListener("input", () => {
    nameInput.setCustomValidity(Pet.checkName(nameInput.value));
});
/*****************************************************************************
 * ### PET_SELECTION
 * - fill with options
 * - change listener
 */
const petSelection = form['petSelection'];
fillSelectWithOptions(petSelection, PetStorage.instances, {
    keyProp: "id",
    displayProp: "name",
});
// when a pet is selected, populate the form with its data
petSelection.addEventListener("change", () => {
    const petKey = petSelection.value;
    // fill the form with the pet's data
    if (petKey) {
        const pet = PetStorage.instances[petKey];
        idOutput.value = petKey;
        nameInput.value = pet.name;
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
    const slots = {
        id: petSelection.value,
        name: nameInput.value,
    };
    // set error messages in case of constraint violations
    nameInput.setCustomValidity(Pet.checkName(slots.name));
    // show possible errors
    form.reportValidity();
    // save the input date only if all of the form fields are valid
    if (form.checkValidity()) {
        // @ts-ignore TODO
        PetStorage.update(slots);
        // update the selection list option element
        petSelection.options[petSelection.selectedIndex].text = slots.name;
    }
});
// neutralize the submit event
form.addEventListener("submit", (e) => {
    e.preventDefault();
    form.reset();
});
//# sourceMappingURL=updatePet.js.map