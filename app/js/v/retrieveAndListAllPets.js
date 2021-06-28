/**
 * @author Christian Prinz
 */
import { PetStorage } from "../m/PetStorage.js";
// this makes my ESLint type this const correctly as "HTMLTableSectionElement"
const tableBody = document.querySelector("table").querySelector("tbody");
// load all pet objects
await PetStorage.retrieveAll();
// for each pet, create a table row with a cell for each attribute
console.log(JSON.stringify(PetStorage.instances));
for (let key of Object.keys(PetStorage.instances)) {
    const row = tableBody.insertRow();
    const pet = PetStorage.instances[key];
    row.insertCell().textContent = pet.id;
    row.insertCell().textContent = pet.name;
    row.insertCell().textContent = pet.species;
    row.insertCell().textContent = pet.birthDate.toLocaleDateString();
}
//# sourceMappingURL=retrieveAndListAllPets.js.map