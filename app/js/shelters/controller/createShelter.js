/**
 * @author Max Bergmann
 */
import { Address } from "../../lib/valueObjects/composed/Address.js";
import { PetStorage } from "../../pets/model/PetStorage.js";
import { Shelter } from "../model/Shelter.js";
import { ShelterStorage } from "../model/ShelterStorage.js";
const form = document.forms.namedItem("Shelter");
// load all
await ShelterStorage.retrieveAll();
await PetStorage.retrieveAll();
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
/** ### SAVE_BUTTON -------------------------------------------------------- */
const saveButton = form["addButton"];
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
//# sourceMappingURL=createShelter.js.map