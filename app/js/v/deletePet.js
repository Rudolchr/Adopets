/**
 * @author Christian Prinz
 */
import { fillSelectWithOptions } from "../lib/util.js";
import { PetStorage } from "../m/PetStorage.js";
const form = document.forms.namedItem("Pet");
const deleteButton = form['deleteButton'];
const petSelection = form['petSelection'];
// load all pets
await PetStorage.retrieveAll();
// set up the pet selection list
fillSelectWithOptions(petSelection, PetStorage.instances, {
    keyProp: "id",
    displayProp: "name",
});
// set an event handler for the delete button
deleteButton.addEventListener("click", () => {
    const id = petSelection.value;
    if (id) {
        PetStorage.destroy(id);
        // remove deleted pet from selection
        petSelection.remove(petSelection.selectedIndex);
    }
});
//# sourceMappingURL=deletePet.js.map