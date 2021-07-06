/**
 * @author Christian Prinz
 */
import { ShelterStorage } from "../../shelters/model/ShelterStorage.js";
import { PetStorage } from "../model/PetStorage.js";
// this makes my ESLint type this const correctly as "HTMLTableSectionElement"
const tableBody = document.querySelector("table").querySelector("tbody");
// load all pet objects
await ShelterStorage.retrieveAll();
await PetStorage.retrieveAll();
// for each pet, create a table row with a cell for each attribute
for (let key of Object.keys(PetStorage.instances)) {
    const row = tableBody.insertRow();
    const pet = PetStorage.instances[key];
    row.insertCell().textContent = pet.id;
    row.insertCell().textContent = pet.name;
    row.insertCell().textContent = pet.species;
    row.insertCell().textContent = pet.sex;
    row.insertCell().textContent = pet.size;
    row.insertCell().textContent = pet.birthDate.toLocaleDateString();
    row.insertCell().textContent = pet.vaccinationStatus;
    row.insertCell().textContent = pet.compatibleWith.join(', ');
    row.insertCell().textContent = pet.suitableWith.join(', ');
    row.insertCell().textContent = pet.housing;
    row.insertCell().textContent = pet.isAdopted ? 'yes' : 'no';
    row.insertCell().textContent = ShelterStorage.instances[pet.shelterId].name;
}
// TODO filters
// TODO hide stuff that requires account (eg. Manage Pets button)
//# sourceMappingURL=retrieveAndListAllPets.js.map