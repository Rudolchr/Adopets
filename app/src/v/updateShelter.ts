/**
 * @author Max Bergmann
 */
import { fillSelectWithEntities } from "../lib/newUtil.js";
import { Shelter } from "../m/Shelter.js";
import { PetStorage } from "../m/PetStorage.js";
import { ShelterStorage } from "../m/ShelterStorage.js";
import { Address } from "../lib/valueObjects/composed/Address.js";
import { OfficeHours } from "../lib/valueObjects/composed/OfficeHours.js";

const form = document.forms.namedItem("Shelter")!;

// load all pets
await ShelterStorage.retrieveAll();
await PetStorage.retrieveAll();

/** ### SHELTER_ID --------------------------------------------------------- */
const idOutput: HTMLOutputElement = form["shelterId"];
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
sheltersunTInput.setCustomValidity(
    OfficeHours.checkTime(sheltersunTInput.value)
  )
);
/** ### SHELTER_DSCRIPTION ------------------------------------------------- */
const shelterDescInput: HTMLInputElement = form["shelterDescription"];
shelterDescInput.addEventListener("input", () => 
  shelterDescInput.setCustomValidity(
    Shelter.checkDescription(shelterDescInput.value)
  )
);


/** ### SHELTER_SELECTION -------------------------------------------------- */
const shelterSelection: HTMLSelectElement = form['shelterSelection'];
fillSelectWithEntities(shelterSelection, ShelterStorage.instances, 'name');

// when a pet is selected, populate the form with its data
shelterSelection.addEventListener("change", () => {
  const shelterKey = shelterSelection.value;

  // fill the form with the pet's data
  if (shelterKey) {
    // read shelter
    const shelter = ShelterStorage.instances[shelterKey];
    // fill inputs
    idOutput.value = shelterKey;
    shelterNameInput.value = shelter.name;
    shelterAddressStreetInput.value = shelter.street;
    shelterAddressNumberInput.value = String(shelter.number);
    shelterAddressCityInput.value = shelter.city;
    shelterPhoneInput.value = shelter.phone;
    shelterEmailInput.value = shelter.email;
    sheltermonFInput.value = shelter.officeHours.times.monday[0];
    sheltermonTInput.value = shelter.officeHours.times.monday[1];
    sheltertueFInput.value = shelter.officeHours.times.tuesday[0];
    sheltertueTInput.value = shelter.officeHours.times.tuesday[1];
    shelterwedFInput.value = shelter.officeHours.times.wednesday[0];
    shelterwedTInput.value = shelter.officeHours.times.wednesday[1];
    shelterthuFInput.value = shelter.officeHours.times.thursday[0];
    shelterthuTInput.value = shelter.officeHours.times.thursday[1];
    shelterfriFInput.value = shelter.officeHours.times.friday[0];
    shelterfriTInput.value = shelter.officeHours.times.friday[1];
    sheltersatFInput.value = shelter.officeHours.times.saturday[0];
    sheltersatTInput.value = shelter.officeHours.times.saturday[1];
    sheltersunFInput.value = shelter.officeHours.times.sunday[0];
    sheltersunTInput.value = shelter.officeHours.times.sunday[1];
    shelterDescInput.value = shelter.description;
  } else {
    form.reset();
  }
});

/** ### SAVE_BUTTON -------------------------------------------------------- */
const saveButton: HTMLButtonElement = form["saveButton"];

// event handler for save button
saveButton.addEventListener("click", () => {
  // set error messages in case of constraint violations
  shelterNameInput.setCustomValidity(Shelter.checkName(shelterNameInput.value));
  shelterAddressStreetInput.setCustomValidity(Address.checkStreet(shelterAddressStreetInput.value));
  shelterAddressNumberInput.setCustomValidity(Address.checkNumber(shelterAddressNumberInput.value));
  shelterAddressCityInput.setCustomValidity(Address.checkCity(shelterAddressCityInput.value));
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

  // save the input date only if all of the form fields are valid
  if (form.checkValidity()) {
    ShelterStorage.update({
      id: shelterSelection.value,
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

    // update the selection list option element
    shelterSelection.options[shelterSelection.selectedIndex].text = shelterNameInput.value;
  }
});

// neutralize the submit event
form.addEventListener("submit", (e) => {
  e.preventDefault();
  form.reset();
});