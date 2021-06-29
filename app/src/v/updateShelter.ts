/**
 * @author Max Bergmann
 */
import { fillSelectWithEntities } from "../lib/newUtil.js";
import { Shelter } from "../m/Shelter.js";
import { PetStorage } from "../m/PetStorage.js";
import { ShelterStorage } from "../m/ShelterStorage.js";
import { Address } from "../lib/valueObjects/composed/Address.js";

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
const shelterOHInput: HTMLInputElement = form["shelterOfficeHours"];
shelterOHInput.addEventListener("input", () =>
  shelterOHInput.setCustomValidity(
    Shelter.checkOfficeHours(shelterOHInput.value)
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
    shelterAddressStreetInput.value = shelter.address.street;
    shelterAddressNumberInput.value = String(shelter.address.number);
    shelterAddressCityInput.value = shelter.address.city;
    shelterPhoneInput.value = shelter.phone;
    shelterEmailInput.value = shelter.email;
    shelterOHInput.value = shelter.officeHours;
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
  shelterOHInput.setCustomValidity(Shelter.checkOfficeHours(shelterOHInput.value));
  shelterDescInput.setCustomValidity(Shelter.checkDescription(shelterDescInput.value));

  // show possible errors
  form.reportValidity();

  // save the input date only if all of the form fields are valid
  if (form.checkValidity()) {
    ShelterStorage.update({
      id: shelterSelection.value,
      name: shelterNameInput.value,
      address: new Address({
        street: shelterAddressStreetInput.value,
        number: +shelterAddressNumberInput.value,
        city: shelterAddressCityInput.value,
      }),
      phone: shelterPhoneInput.value,
      email: shelterEmailInput.value,
      officeHours: shelterOHInput.value,
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