import { fillSelectWithOptions } from "../lib/util.js";
import { PetStorage } from "../m/PetStorage.js";
const form = document.forms.namedItem("Pet");
const deleteButton = form['deleteButton'];
const petSelection = form['petSelection'];
PetStorage.retrieveAll();
fillSelectWithOptions(petSelection, PetStorage.instances, {
    keyProp: "petId",
    displayProp: "name",
});
deleteButton.addEventListener("click", () => {
    const petId = petSelection.value;
    if (petId) {
        PetStorage.destroy(petId);
        petSelection.remove(petSelection.selectedIndex);
    }
});
window.addEventListener("beforeunload", () => PetStorage.persist());
//# sourceMappingURL=deletePet.js.map