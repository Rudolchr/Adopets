/**
 * @author Christian Prinz
 */
import { Pet } from "../m/Pet.js";
import { PetStorage } from "../m/PetStorage.js";
const form = document.forms.namedItem("Pet");
// load all pets
await PetStorage.retrieveAll();
/*****************************************************************************
 * ### TITLE
 * - responsive validation
 * @type {HTMLInputElement}
 */
const nameSelection = form["petName"];
nameSelection.addEventListener("input", () => nameSelection.setCustomValidity(Pet.checkName(nameSelection.value)));
/*****************************************************************************
 * ### SAVE_BUTTON
 * - set an event handler for the save button
 * - neutralize form on submit
 * @type {HTMLButtonElement}
 */
const saveButton = form["addButton"];
saveButton.addEventListener("click", () => {
    const slots = {
        name: nameSelection.value,
    };
    // set error messages in case of constraint violations
    nameSelection.setCustomValidity(Pet.checkName(slots.name));
    // show possible errors
    form.reportValidity();
    // save the input data only if all of the form fields are valid
    form.checkValidity() && PetStorage.add(slots);
});
// neutralize the submit event
form.addEventListener("submit", (e) => {
    e.preventDefault();
    form.reset();
});
// Set a handler for the event when the browser window/tab is closed
//# sourceMappingURL=createPet.js.map