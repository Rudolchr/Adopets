/**
 * @author Christian Prinz
 */
import { Pet, PetSlots } from "../m/Pet.js";
import { PetStorage } from "../m/PetStorage.js";

const form = document.forms.namedItem("Pet")!;

// load all pets + get next ID
PetStorage.retrieveAll();

/*****************************************************************************
 * ### PET_ID
 * - get the next id initially
 * @type {HTMLOutputElement}
 */
const petIdInput: HTMLOutputElement = form["petId"];
petIdInput.addEventListener("input", () =>
  petIdInput.setCustomValidity(Pet.checkPetId(petIdInput.value))
);
petIdInput.value = PetStorage.nextId().toString();

/*****************************************************************************
 * ### TITLE
 * - responsive validation
 * @type {HTMLInputElement}
 */
const nameSelection: HTMLInputElement = form["petName"];
nameSelection.addEventListener("input", () =>
  nameSelection.setCustomValidity(
    Pet.checkName(nameSelection.value)
  )
);

/*****************************************************************************
 * ### SAVE_BUTTON
 * - set an event handler for the save button
 * - neutralize form on submit
 * @type {HTMLButtonElement}
 */
const saveButton: HTMLButtonElement = form["addButton"];
saveButton.addEventListener("click", () => {
  const slots: PetSlots = {
    petId: petIdInput.value,
    name: nameSelection.value,
  };

  // set error messages in case of constraint violations
  petIdInput.setCustomValidity(Pet.checkPetId(slots.petId));
  nameSelection.setCustomValidity(Pet.checkName(slots.name));

  // show possible errors
  form.reportValidity();

  // save the input data only if all of the form fields are valid
  // @ts-ignore
  form.checkValidity() && PetStorage.add(slots);
});

// neutralize the submit event
form.addEventListener("submit", (e) => {
  e.preventDefault();
  form.reset();
  petIdInput.value = PetStorage.nextId().toString();
});

// Set a handler for the event when the browser window/tab is closed
window.addEventListener("beforeunload", () => PetStorage.persist());
