/**
 * @author Max Bergmann
 */
import { fillSelectWithEntities } from "../../lib/newUtil.js";
import { Address } from "../../lib/valueObjects/composed/Address.js";
import { PetStorage } from "../../pets/model/PetStorage.js";
import { Shelter } from "../model/Shelter.js";
import { ShelterStorage } from "../model/ShelterStorage.js";
const form = document.forms.namedItem("Shelter");
// load all pets
await ShelterStorage.retrieveAll();
await PetStorage.retrieveAll();
/** ### SHELTER_ID --------------------------------------------------------- */
const idOutput = form["shelterId"];
/** ### SHELTER_NAME ------------------------------------------------------- */
const shelterNameInput = form["shelterName"];
shelterNameInput.addEventListener("input", () => shelterNameInput.setCustomValidity(Shelter.checkName(shelterNameInput.value)));
/** ### SHELTER_ADDRESS ---------------------------------------------------- */
const shelterAddressStreetInput = form["AddressStreet"];
shelterAddressStreetInput.addEventListener("input", () => shelterAddressStreetInput.setCustomValidity(Address.checkStreet(shelterAddressStreetInput.value)));
const shelterAddressNumberInput = form["AddressNumber"];
shelterAddressNumberInput.addEventListener("input", () => shelterAddressNumberInput.setCustomValidity(Address.checkNumber(shelterAddressNumberInput.value)));
const shelterAddressCityInput = form["AddressCity"];
shelterAddressCityInput.addEventListener("input", () => shelterAddressCityInput.setCustomValidity(Address.checkCity(shelterAddressCityInput.value)));
/** ### SHELTER_PHONE ------------------------------------------------------ */
const shelterPhoneInput = form["shelterPhone"];
shelterPhoneInput.addEventListener("input", () => shelterPhoneInput.setCustomValidity(Shelter.checkPhone(shelterPhoneInput.value)));
/** ### SHELTER_EMAIL ------------------------------------------------------ */
const shelterEmailInput = form["shelterEmail"];
shelterEmailInput.addEventListener("input", () => shelterEmailInput.setCustomValidity(Shelter.checkEmail(shelterEmailInput.value)));
/** ### SHELTER_OFFICE_HOURS ----------------------------------------------- */
const sheltermonFInput = form["monF"];
const sheltermonTInput = form["monT"];
const sheltertueFInput = form["tueF"];
const sheltertueTInput = form["tueT"];
const shelterwedFInput = form["wedF"];
const shelterwedTInput = form["wedT"];
const shelterthuFInput = form["thuF"];
const shelterthuTInput = form["thuT"];
const shelterfriFInput = form["friF"];
const shelterfriTInput = form["friT"];
const sheltersatFInput = form["satF"];
const sheltersatTInput = form["satT"];
const sheltersunFInput = form["sunF"];
const sheltersunTInput = form["sunT"];
/** ### SHELTER_DSCRIPTION ------------------------------------------------- */
const shelterDescInput = form["shelterDescription"];
shelterDescInput.addEventListener("input", () => shelterDescInput.setCustomValidity(Shelter.checkDescription(shelterDescInput.value)));
/** ### SHELTER_SELECTION -------------------------------------------------- */
const shelterSelection = form['shelterSelection'];
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
    }
    else {
        form.reset();
    }
});
/** ### SAVE_BUTTON -------------------------------------------------------- */
const saveButton = form["saveButton"];
// event handler for save button
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
    const oh = {
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
    // save the input date only if all of the form fields are valid
    if (form.checkValidity()) {
        ShelterStorage.update({
            id: shelterSelection.value,
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
        // update the selection list option element
        shelterSelection.options[shelterSelection.selectedIndex].text = shelterNameInput.value;
    }
});
// neutralize the submit event
form.addEventListener("submit", (e) => {
    e.preventDefault();
    form.reset();
});
//# sourceMappingURL=updateShelter.js.map