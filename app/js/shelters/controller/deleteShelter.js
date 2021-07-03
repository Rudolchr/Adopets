/**
 * @author Max Bergmann
 */
import { fillSelectWithOptions } from "../../lib/util.js";
import { PetStorage } from "../../pets/model/PetStorage.js";
import { ShelterStorage } from "../model/ShelterStorage.js";
const form = document.forms.namedItem("Shelter");
const deleteButton = form['deleteButton'];
const shelterSelection = form['shelterSelection'];
// load all pets
await ShelterStorage.retrieveAll();
await PetStorage.retrieveAll();
// set up the shelter selection list
fillSelectWithOptions(shelterSelection, ShelterStorage.instances, {
    keyProp: "id",
    displayProp: "name",
});
// set an event handler for the delete button
deleteButton.addEventListener("click", () => {
    const id = shelterSelection.value;
    if (id) {
        if (confirm("Do you really want to delete this Movie?")) {
            ShelterStorage.destroy(id);
            // remove deleted shelter from selection
            shelterSelection.remove(shelterSelection.selectedIndex);
        }
    }
});
//# sourceMappingURL=deleteShelter.js.map