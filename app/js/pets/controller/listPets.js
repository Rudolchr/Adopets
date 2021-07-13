/**
 * @author Christian Prinz
 */
import { ShelterStorage } from "../../shelters/model/ShelterStorage.js";
import { PetStorage } from "../model/PetStorage.js";
const tableBody = document.querySelector("table").querySelector("tbody");
export function clearTableBody() {
    tableBody.innerHTML = '';
}
export function insertToTable(filter, hideProps = []) {
    // for each pet, create a table row with a cell for each attribute
    for (let pet of Object.values(PetStorage.instances).filter(filter)) {
        const row = tableBody.insertRow();
        if (!hideProps.includes('name')) {
            row.insertCell().textContent = pet.name;
        }
        if (!hideProps.includes('species')) {
            row.insertCell().textContent = pet.species;
        }
        if (!hideProps.includes('sex')) {
            row.insertCell().textContent = pet.sex;
        }
        if (!hideProps.includes('size')) {
            row.insertCell().textContent = pet.size;
        }
        if (!hideProps.includes('birthDate')) {
            row.insertCell().textContent = pet.birthDate.toLocaleDateString();
        }
        if (!hideProps.includes('vaccinationStatus')) {
            row.insertCell().textContent = pet.vaccinationStatus;
        }
        if (!hideProps.includes('compatibleWith')) {
            row.insertCell().textContent = pet.compatibleWith.join(', ');
        }
        if (!hideProps.includes('suitableWith')) {
            row.insertCell().textContent = pet.suitableWith.join(', ');
        }
        if (!hideProps.includes('housing')) {
            row.insertCell().textContent = pet.housing;
        }
        if (!hideProps.includes('shelterId')) {
            const shelter = row.insertCell();
            console.log(ShelterStorage.instances);
            shelter.textContent = ShelterStorage.instances[pet.shelterId]?.name + '\n';
            const messageButton = document.createElement('button');
            messageButton.textContent = "contact";
            messageButton.className = 'submitButton';
            messageButton.addEventListener('click', () => {
                location.href = `/messages/write.html?shelterId=${pet.shelterId}&petId=${pet.id}`;
            });
            shelter.appendChild(messageButton);
        }
    }
}
// TODO filters
//# sourceMappingURL=listPets.js.map