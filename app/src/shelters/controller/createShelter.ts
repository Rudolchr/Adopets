/**
 * @author Max Bergmann
 */
import {Address} from "../../lib/valueObjects/composed/Address.js";
import {OHSlots} from "../../lib/valueObjects/composed/OfficeHours.js";
import {PetStorage} from "../../pets/model/PetStorage.js";
import {Shelter} from "../model/Shelter.js";
import {ShelterStorage} from "../model/ShelterStorage.js";

const form = document.forms.namedItem("Shelter")!;

// load all
await ShelterStorage.retrieveAll();
await PetStorage.retrieveAll();

/** ### SHELTER_NAME ------------------------------------------------------- */
const shelterNameInput: HTMLInputElement = form["shelterName"];
shelterNameInput.addEventListener("input", () =>
  shelterNameInput.setCustomValidity(
    Shelter.checkName(shelterNameInput.value)
  )
);

/** ### SHELTER_ADDRESS ---------------------------------------------------- */
const shelterAddressStreetInput: HTMLInputElement = form["AddressStreet"];
shelterAddressStreetInput.addEventListener("input", () =>
  shelterAddressStreetInput.setCustomValidity(
    Address.checkStreet(shelterAddressStreetInput.value)
  )
);
const shelterAddressNumberInput: HTMLInputElement = form["AddressNumber"];
shelterAddressNumberInput.addEventListener("input", () =>
  shelterAddressNumberInput.setCustomValidity(
    Address.checkNumber(shelterAddressNumberInput.value)
  )
);
const shelterAddressCityInput: HTMLInputElement = form["AddressCity"];
shelterAddressCityInput.addEventListener("input", () =>
  shelterAddressCityInput.setCustomValidity(
    Address.checkCity(shelterAddressCityInput.value)
  )
);

/** ### SHELTER_PHONE ------------------------------------------------------ */
const shelterPhoneInput: HTMLInputElement = form["shelterPhone"];
shelterPhoneInput.addEventListener("input", () =>
  shelterPhoneInput.setCustomValidity(
    Shelter.checkPhone(shelterPhoneInput.value)
  )
);

/** ### SHELTER_EMAIL ------------------------------------------------------ */
const shelterEmailInput: HTMLInputElement = form["shelterEmail"];
shelterEmailInput.addEventListener("input", () =>
  shelterEmailInput.setCustomValidity(
    Shelter.checkEmail(shelterEmailInput.value)
  )
);

/** ### SHELTER_OFFICE_HOURS ----------------------------------------------- */
const sheltermonFInput: HTMLInputElement = form["monF"];
const sheltermonTInput: HTMLInputElement = form["monT"];
const sheltertueFInput: HTMLInputElement = form["tueF"];
const sheltertueTInput: HTMLInputElement = form["tueT"];
const shelterwedFInput: HTMLInputElement = form["wedF"];
const shelterwedTInput: HTMLInputElement = form["wedT"];
const shelterthuFInput: HTMLInputElement = form["thuF"];
const shelterthuTInput: HTMLInputElement = form["thuT"];
const shelterfriFInput: HTMLInputElement = form["friF"];
const shelterfriTInput: HTMLInputElement = form["friT"];
const sheltersatFInput: HTMLInputElement = form["satF"];
const sheltersatTInput: HTMLInputElement = form["satT"];
const sheltersunFInput: HTMLInputElement = form["sunF"];
const sheltersunTInput: HTMLInputElement = form["sunT"];

/** ### SHELTER_DSCRIPTION ------------------------------------------------- */
const shelterDescInput: HTMLInputElement = form["shelterDescription"];
shelterDescInput.addEventListener("input", () =>
  shelterDescInput.setCustomValidity(
    Shelter.checkDescription(shelterDescInput.value)
  )
);

/** ### SAVE_BUTTON -------------------------------------------------------- */
const saveButton: HTMLButtonElement = form["addButton"];
saveButton.addEventListener("click", () => {

  // set error messages in case of constraint violations
  shelterNameInput.setCustomValidity(Shelter.checkName(shelterNameInput.value));
  shelterAddressStreetInput.setCustomValidity(Address.checkStreet(shelterAddressStreetInput.value));
  shelterAddressNumberInput.setCustomValidity(Address.checkNumber(shelterAddressNumberInput.value));
  shelterAddressCityInput.setCustomValidity(Address.checkCity(shelterAddressCityInput.value));
  shelterPhoneInput.setCustomValidity(Shelter.checkPhone(shelterPhoneInput.value));
  shelterEmailInput.setCustomValidity(Shelter.checkEmail(shelterEmailInput.value));
  shelterDescInput.setCustomValidity(Shelter.checkDescription(shelterDescInput.value));

  // check if for each given time also a opening/closing time is given
  const oh: OHSlots = {
    monday: [sheltermonFInput.value, sheltermonTInput.value],
    tuesday: [sheltertueFInput.value, sheltertueTInput.value],
    wednesday: [shelterwedFInput.value, shelterwedTInput.value],
    thursday: [shelterthuFInput.value, shelterthuTInput.value],
    friday: [shelterfriFInput.value, shelterfriTInput.value],
    saturday: [sheltersatFInput.value, sheltersatTInput.value],
    sunday: [sheltersunFInput.value, sheltersunTInput.value],
  };
  sheltermonFInput.setCustomValidity(Shelter.checkOfficeHours(oh));

  // show possible errors
  form.reportValidity();

  // save the input data only if all of the form fields are valid
  form.checkValidity() && ShelterStorage.add({
    name: shelterNameInput.value,
    address: {
      street: shelterAddressStreetInput.value,
      number: +shelterAddressNumberInput.value,
      city: shelterAddressCityInput.value,
    },
    phone: shelterPhoneInput.value,
    email: shelterEmailInput.value,
    officeHours: {
      monday: [sheltermonFInput.value, sheltermonTInput.value],
      tuesday: [sheltertueFInput.value, sheltertueTInput.value],
      wednesday: [shelterwedFInput.value, shelterwedTInput.value],
      thursday: [shelterthuFInput.value, shelterthuTInput.value],
      friday: [shelterfriFInput.value, shelterfriTInput.value],
      saturday: [sheltersatFInput.value, sheltersatTInput.value],
      sunday: [sheltersunFInput.value, sheltersunTInput.value],
    },
    description: shelterDescInput.value,
  });
});

// neutralize the submit event
form.addEventListener("submit", (e) => {
  e.preventDefault();
  form.reset();
});

// Set a handler for the event when the browser window/tab is closed