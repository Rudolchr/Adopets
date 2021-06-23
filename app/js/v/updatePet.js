import { fillSelectWithOptions } from "../lib/util.js";
import { Pet } from "../m/Pet.js";
import { PetStorage } from "../m/PetStorage.js";
const form = document.forms.namedItem("Pet");
PetStorage.retrieveAll();
const petIdOutput = form["petId"];
const nameInput = form["petName"];
nameInput.addEventListener("input", () => {
    nameInput.setCustomValidity(Pet.checkName(nameInput.value));
});
const petSelection = form['petSelection'];
fillSelectWithOptions(petSelection, PetStorage.instances, {
    keyProp: "petId",
    displayProp: "name",
});
petSelection.addEventListener("change", () => {
    const petKey = petSelection.value;
    if (petKey) {
        const pet = PetStorage.instances[petKey];
        petIdOutput.value = petKey;
        nameInput.value = pet.name;
    }
    else {
        form.reset();
    }
});
const saveButton = form["saveButton"];
saveButton.addEventListener("click", () => {
    const slots = {
        petId: petSelection.value,
        name: nameInput.value,
    };
    nameInput.setCustomValidity(Pet.checkName(slots.name));
    form.reportValidity();
    if (form.checkValidity()) {
        PetStorage.update(slots);
        petSelection.options[petSelection.selectedIndex].text = slots.name;
    }
});
form.addEventListener("submit", (e) => {
    e.preventDefault();
    form.reset();
});
window.addEventListener("beforeunload", () => PetStorage.persist());
//# sourceMappingURL=updatePet.js.map