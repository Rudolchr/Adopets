import { Pet } from "../m/Pet.js";
import { PetStorage } from "../m/PetStorage.js";
const form = document.forms.namedItem("Pet");
PetStorage.retrieveAll();
const petIdInput = form["petId"];
petIdInput.addEventListener("input", () => petIdInput.setCustomValidity(Pet.checkPetId(petIdInput.value)));
petIdInput.value = PetStorage.nextId().toString();
const nameSelection = form["petName"];
nameSelection.addEventListener("input", () => nameSelection.setCustomValidity(Pet.checkName(nameSelection.value)));
const saveButton = form["addButton"];
saveButton.addEventListener("click", () => {
    const slots = {
        petId: petIdInput.value,
        name: nameSelection.value,
    };
    petIdInput.setCustomValidity(Pet.checkPetId(slots.petId));
    nameSelection.setCustomValidity(Pet.checkName(slots.name));
    form.reportValidity();
    form.checkValidity() && PetStorage.add(slots);
});
form.addEventListener("submit", (e) => {
    e.preventDefault();
    form.reset();
    petIdInput.value = PetStorage.nextId().toString();
});
window.addEventListener("beforeunload", () => PetStorage.persist());
//# sourceMappingURL=createPet.js.map