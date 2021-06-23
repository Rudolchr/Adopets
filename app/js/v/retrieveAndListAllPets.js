import { PetStorage } from "../m/PetStorage.js";
const tableBody = document.querySelector("table").querySelector("tbody");
PetStorage.retrieveAll();
for (let key of Object.keys(PetStorage.instances)) {
    const row = tableBody.insertRow();
    const pet = PetStorage.instances[key];
    row.insertCell().textContent = pet.petId.toString();
    row.insertCell().textContent = pet.name;
}
//# sourceMappingURL=retrieveAndListAllPets.js.map