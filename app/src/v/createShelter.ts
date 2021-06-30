/**
 * @author Max Bergmann
 */
import { Address } from "../lib/valueObjects/composed/Address.js";
import { OfficeHours, OHSlots } from "../lib/valueObjects/composed/OfficeHours.js";
import { PetStorage } from "../m/PetStorage.js";
import { Shelter, ShelterSlots } from "../m/Shelter.js";
import { ShelterStorage } from "../m/ShelterStorage.js";

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
    Shelter.checkStreet(shelterAddressStreetInput.value)
  )
);
const shelterAddressNumberInput: HTMLInputElement = form["AddressNumber"];
shelterAddressNumberInput.addEventListener("input", () =>
  shelterAddressNumberInput.setCustomValidity(
    Shelter.checkNumber(shelterAddressNumberInput.value)
  )
);
const shelterAddressCityInput: HTMLInputElement = form["AddressStreet"];
shelterAddressCityInput.addEventListener("input", () =>
  shelterAddressCityInput.setCustomValidity(
    Shelter.checkCity(shelterAddressCityInput.value)
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
sheltermonFInput.addEventListener("input", () =>
  sheltermonFInput.setCustomValidity(
    OfficeHours.checkTime(sheltermonFInput.value)
  )
);
const sheltermonTInput: HTMLInputElement = form["monT"];
sheltermonTInput.addEventListener("input", () =>
sheltermonTInput.setCustomValidity(
    OfficeHours.checkTime(sheltermonTInput.value)
  )
);

const sheltertueFInput: HTMLInputElement = form["tueF"];
sheltertueFInput.addEventListener("input", () =>
  sheltertueFInput.setCustomValidity(
    OfficeHours.checkTime(sheltertueFInput.value)
  )
);
const sheltertueTInput: HTMLInputElement = form["tueT"];
sheltertueTInput.addEventListener("input", () =>
sheltertueTInput.setCustomValidity(
    OfficeHours.checkTime(sheltertueTInput.value)
  )
);

const shelterwedFInput: HTMLInputElement = form["wedF"];
shelterwedFInput.addEventListener("input", () =>
  shelterwedFInput.setCustomValidity(
    OfficeHours.checkTime(shelterwedFInput.value)
  )
);
const shelterwedTInput: HTMLInputElement = form["wedT"];
shelterwedTInput.addEventListener("input", () =>
shelterwedTInput.setCustomValidity(
    OfficeHours.checkTime(shelterwedTInput.value)
  )
);

const shelterthuFInput: HTMLInputElement = form["thuF"];
shelterthuFInput.addEventListener("input", () =>
  shelterthuFInput.setCustomValidity(
    OfficeHours.checkTime(shelterthuFInput.value)
  )
);
const shelterthuTInput: HTMLInputElement = form["thuT"];
shelterthuTInput.addEventListener("input", () =>
shelterthuTInput.setCustomValidity(
    OfficeHours.checkTime(shelterthuTInput.value)
  )
);

const shelterfriFInput: HTMLInputElement = form["friF"];
shelterfriFInput.addEventListener("input", () =>
  shelterfriFInput.setCustomValidity(
    OfficeHours.checkTime(shelterfriFInput.value)
  )
);
const shelterfriTInput: HTMLInputElement = form["friT"];
shelterfriTInput.addEventListener("input", () =>
shelterfriTInput.setCustomValidity(
    OfficeHours.checkTime(shelterfriTInput.value)
  )
);

const sheltersatFInput: HTMLInputElement = form["satF"];
sheltersatFInput.addEventListener("input", () =>
  sheltersatFInput.setCustomValidity(
    OfficeHours.checkTime(sheltersatFInput.value)
  )
);
const sheltersatTInput: HTMLInputElement = form["satT"];
sheltersatTInput.addEventListener("input", () =>
sheltersatTInput.setCustomValidity(
    OfficeHours.checkTime(sheltersatTInput.value)
  )
);

const sheltersunFInput: HTMLInputElement = form["sunF"];
sheltersunFInput.addEventListener("input", () =>
  sheltersunFInput.setCustomValidity(
    OfficeHours.checkTime(sheltersunFInput.value)
  )
);
const sheltersunTInput: HTMLInputElement = form["sunT"];
sheltersunTInput.addEventListener("input", () =>
    checkHours(
      sheltersunTInput.setCustomValidity(
        OfficeHours.checkTime(sheltersunTInput.value)
      )
    )
);

/** ### SHELTER_DSCRIPTION ------------------------------------------------- */
const shelterDescInput: HTMLInputElement = form["shelterDescription"];
shelterDescInput.addEventListener("input", () => 
  shelterDescInput.setCustomValidity(
    Shelter.checkDescription(shelterDescInput.value)
  )
);

function checkHours(validFunction: any) {
  const oh: OHSlots = {
    monday: [sheltermonFInput.value, sheltermonTInput.value],
    tuesday: [sheltertueFInput.value, sheltertueTInput.value],
    wednesday: [shelterwedFInput.value, shelterwedTInput.value],
    thursday: [shelterthuFInput.value, shelterthuTInput.value],
    friday: [shelterfriFInput.value, shelterfriTInput.value],
    saturday: [sheltersatFInput.value, sheltersatTInput.value],
    sunday: [sheltersunFInput.value, sheltersunTInput.value],
  };

  sheltermonFInput.setCustomValidity(
    Shelter.checkOfficeHours(oh)
  );

  validFunction();
}

/** ### SAVE_BUTTON -------------------------------------------------------- */
const saveButton: HTMLButtonElement = form["addButton"];
saveButton.addEventListener("click", () => {

  // set error messages in case of constraint violations
  shelterNameInput.setCustomValidity(Shelter.checkName(shelterNameInput.value));
  shelterAddressStreetInput.setCustomValidity(Shelter.checkStreet(shelterAddressStreetInput.value));
  shelterAddressNumberInput.setCustomValidity(Shelter.checkNumber(shelterAddressNumberInput.value));
  shelterAddressCityInput.setCustomValidity(Shelter.checkCity(shelterAddressCityInput.value));
  shelterPhoneInput.setCustomValidity(Shelter.checkPhone(shelterPhoneInput.value));
  shelterEmailInput.setCustomValidity(Shelter.checkEmail(shelterEmailInput.value));
  sheltermonFInput.setCustomValidity(OfficeHours.checkTime(sheltermonFInput.value));
  sheltermonTInput.setCustomValidity(OfficeHours.checkTime(sheltermonTInput.value));
  sheltertueFInput.setCustomValidity(OfficeHours.checkTime(sheltertueFInput.value));
  sheltertueTInput.setCustomValidity(OfficeHours.checkTime(sheltertueTInput.value));
  shelterwedFInput.setCustomValidity(OfficeHours.checkTime(shelterwedFInput.value));
  shelterwedTInput.setCustomValidity(OfficeHours.checkTime(shelterwedTInput.value));
  shelterthuFInput.setCustomValidity(OfficeHours.checkTime(shelterthuFInput.value));
  shelterthuTInput.setCustomValidity(OfficeHours.checkTime(shelterthuTInput.value));
  shelterfriFInput.setCustomValidity(OfficeHours.checkTime(shelterfriFInput.value));
  shelterfriTInput.setCustomValidity(OfficeHours.checkTime(shelterfriTInput.value));
  sheltersatFInput.setCustomValidity(OfficeHours.checkTime(sheltersatFInput.value));
  sheltersatTInput.setCustomValidity(OfficeHours.checkTime(sheltersatTInput.value));
  sheltersunFInput.setCustomValidity(OfficeHours.checkTime(sheltersunFInput.value));
  sheltersunTInput.setCustomValidity(OfficeHours.checkTime(sheltersunTInput.value));
  shelterDescInput.setCustomValidity(Shelter.checkDescription(shelterDescInput.value));

  // show possible errors
  form.reportValidity();

  // save the input data only if all of the form fields are valid
  form.checkValidity() && ShelterStorage.add({
    name: shelterNameInput.value,
    street: shelterAddressStreetInput.value,
    number: +shelterAddressNumberInput.value,
    city: shelterAddressCityInput.value,
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