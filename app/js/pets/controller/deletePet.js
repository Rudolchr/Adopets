/**
 * @author Christian Prinz
 */
import { fillSelectWithEntities } from "../../lib/forms/FormUtil.js";
import { PetStorage } from "../model/PetStorage.js";
const form = document.forms.namedItem("Pet");
const petSelection = form['petSelection'];
// load all pets
await PetStorage.retrieveAll();
// set up the pet selection list
fillSelectWithEntities(petSelection, PetStorage.instances, 'name');
// Delete Button
const deleteButton = form['deleteButton'];
deleteButton.addEventListener("click", () => {
    const id = petSelection.value;
    if (id) {
        PetStorage.destroy(id);
        // remove deleted pet from selection
        petSelection.remove(petSelection.selectedIndex);
    }
});
//# sourceMappingURL=deletePet.js.map