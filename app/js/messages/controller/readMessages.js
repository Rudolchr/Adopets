/**
 * @author Christian Prinz
 */
import { PetStorage } from "../../pets/model/PetStorage.js";
import { ShelterStorage } from "../../shelters/model/ShelterStorage.js";
import { MessageStorage } from "../model/MessageStorage.js";
// this makes my ESLint type this const correctly as "HTMLTableSectionElement"
const tableBody = document.querySelector("table").querySelector("tbody");
// load all pet objects
await MessageStorage.retrieveAll();
await ShelterStorage.retrieveAll();
await PetStorage.retrieveAll();
let userSpecificStorage = [];
if (auth.currentUser?.uid) {
    userSpecificStorage = ShelterStorage.getUserShelterIds(auth.currentUser?.uid);
}
MessageStorage.retrieveAllFromUser(userSpecificStorage);
// for each pet, create a table row with a cell for each attribute
for (let message of Object.values(MessageStorage.retrieveAllFromUser(userSpecificStorage))) {
    // TODO filter out messages that regard to shelters that have the accounts userId
    const row = tableBody.insertRow();
    row.insertCell().textContent = ShelterStorage.instances[message.shelterId].name;
    row.insertCell().textContent = message.petId ? PetStorage.instances[message.petId].name : '';
    // TODO multiline
    row.insertCell().textContent = message.message;
    row.insertCell().textContent = message.senderEmail ?? '';
    row.insertCell().textContent = message.senderPhoneNo ?? '';
    const msgButton = document.createElement('button');
    msgButton.textContent = "delete";
    msgButton.className = 'submitButton';
    msgButton.addEventListener('click', async () => {
        await MessageStorage.destroy(message.id);
        window.location.pathname = "/messages/index.html";
    });
    row.insertCell().appendChild(msgButton);
}
//# sourceMappingURL=readMessages.js.map