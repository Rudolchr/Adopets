/**
 * @author Max Bergmann
 */
import {PetStorage} from "../m/PetStorage.js";
import {ShelterStorage} from "../m/ShelterStorage.js";
import {fillSelectWithOptions} from "../lib/util.js";

const form = document.forms.namedItem("Shelter")!;
const deleteButton: HTMLButtonElement = form['deleteButton'];
const shelterSelection: HTMLSelectElement = form['shelterSelection'];

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
    ShelterStorage.destroy(id);

    // remove deleted shelter from selection
    shelterSelection.remove(shelterSelection.selectedIndex);
  }
});