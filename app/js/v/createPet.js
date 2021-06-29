/**
 * @author Christian Prinz
 */
import { FormFactory } from "../lib/FormFactory.js";
import { Pet, SpeciesEnum } from "../m/Pet.js";
import { PetStorage } from "../m/PetStorage.js";
import { ShelterStorage } from "../m/ShelterStorage.js";
// load all pets
await ShelterStorage.retrieveAll();
await PetStorage.retrieveAll();
// we use the factory to create the view logic for the Form
const formFactory = new FormFactory("Pet");
// which elements should be manipulated with this Form
const formElements = {
    name: formFactory.createInput("petName", Pet.checkName),
    species: formFactory.createRangeSelection("species", Pet.checkSpecies, SpeciesEnum),
    birthDate: formFactory.createInput("birthDate", Pet.checkBirthDate),
    shelterId: formFactory.createReferenceSelection("shelter", Pet.checkShelterId, ShelterStorage.instances, 'name'),
};
formFactory.createSubmitButton('addButton', formElements, (slots) => PetStorage.add(slots));
//# sourceMappingURL=createPet.js.map