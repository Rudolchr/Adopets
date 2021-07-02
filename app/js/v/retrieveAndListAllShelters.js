/**
 * @author Max Bergmann
 */
import { createListFromList } from "../lib/newUtil.js";
import { PetStorage } from "../m/PetStorage.js";
import { ShelterStorage } from "../m/ShelterStorage.js";
// this makes my ESLint type this const correctly as "HTMLTableSectionElement"
const tableBody = document.querySelector("table").querySelector("tbody");
// load all pet objects
await ShelterStorage.retrieveAll();
await PetStorage.retrieveAll();
// for each pet, create a table row with a cell for each attribute
for (let key of Object.keys(ShelterStorage.instances)) {
    const row = tableBody.insertRow();
    const shelter = ShelterStorage.instances[key];
    row.insertCell().textContent = shelter.name;
    row.insertCell().textContent = shelter.address.toString();
    row.insertCell().textContent = shelter.email;
    const timeList = createListFromList(shelter.officeHours.toList());
    if (timeList.childElementCount > 0) {
        row.insertCell().appendChild(timeList);
    }
    else {
        row.insertCell().textContent = "Closed!";
    }
    row.insertCell().textContent = shelter.description;
}
//# sourceMappingURL=retrieveAndListAllShelters.js.map