/**
 * @author Christian Prinz
 */
import {Pet} from "../m/Pet.js";
import {PetStorage} from "../m/PetStorage.js";

const form = document.forms.namedItem("Pet")!;

// load all pets
await PetStorage.retrieveAll();

/** ### PET_NAME ----------------------------------------------------------- */
const petNameInput: HTMLInputElement = form["petName"];
petNameInput.addEventListener("input", () =>
  petNameInput.setCustomValidity(
    Pet.checkName(petNameInput.value)
  )
);

/** ### SPECIES ------------------------------------------------------------ */
const speciesSelection: HTMLSelectElement = form["species"];
speciesSelection.addEventListener("change", () => {
  speciesSelection.setCustomValidity(
    Pet.checkSpecies(speciesSelection.value)
  );
});

/** ### BIRTH_DATE ------------------------------------------------------- */
const birthDateInput: HTMLInputElement = form["birthDate"];
birthDateInput.addEventListener("input", () => {
  birthDateInput.setCustomValidity(
    Pet.checkBirthDate(birthDateInput.value)
  );
});

/** ### SAVE_BUTTON -------------------------------------------------------- */
const saveButton: HTMLButtonElement = form["addButton"];
saveButton.addEventListener("click", () => {

  // set error messages in case of constraint violations
  petNameInput.setCustomValidity(Pet.checkName(petNameInput.value));
  speciesSelection.setCustomValidity(Pet.checkSpecies(speciesSelection.value));
  birthDateInput.setCustomValidity(Pet.checkBirthDate(birthDateInput.value));

  // show possible errors
  form.reportValidity();

  // save the input data only if all of the form fields are valid
  form.checkValidity() && PetStorage.add({
    name: petNameInput.value,
    species: speciesSelection.value,
    birthDate: birthDateInput.value,
  });
});

// neutralize the submit event
form.addEventListener("submit", (e) => {
  e.preventDefault();
  form.reset();
});

// Set a handler for the event when the browser window/tab is closed
