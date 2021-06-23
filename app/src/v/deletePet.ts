/**
 * @author Christian Prinz
 */

import {fillSelectWithOptions} from "../lib/util.js";
import { PetStorage } from "../m/PetStorage.js";

const form = document.forms.namedItem("Pet")!;
const deleteButton: HTMLButtonElement = form['deleteButton'];
const petSelection: HTMLSelectElement = form['petSelection'];

// load all pets
PetStorage.retrieveAll();

// set up the pet selection list
fillSelectWithOptions(petSelection, PetStorage.instances, {
  keyProp: "petId",
  displayProp: "name",
});

// set an event handler for the delete button
deleteButton.addEventListener("click", () => {
  const petId = petSelection.value;
  if (petId) {
    PetStorage.destroy(petId);

    // remove deleted pet from selection
    petSelection.remove(petSelection.selectedIndex);
  }
});

// set a handler for the event when the browser / tab is closed
window.addEventListener("beforeunload", () => PetStorage.persist());
