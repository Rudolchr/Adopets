import { createChoiceWidget, fillSelectWithEntities, fillSelectWithRange, } from "../../lib/forms/FormUtil.js";
import { ShelterStorage } from "../../shelters/model/ShelterStorage.js";
import { HousingEnum, SexEnum, SizeEnum, SpeciesEnum, SuitableWithEnum, } from "../model/Pet.js";
import { PetStorage } from "../model/PetStorage.js";
import { clearTableBody, insertToTable } from "./listPets.js";
await ShelterStorage.retrieveAll();
await PetStorage.retrieveAll();
insertToTable((pet) => !pet.isAdopted);
const speciesFilter = document.querySelector("#speciesFilter");
fillSelectWithRange(speciesFilter, SpeciesEnum, []);
speciesFilter.addEventListener("change", () => filter());
const sexFilter = document.querySelector("#sexFilter");
fillSelectWithRange(sexFilter, SexEnum, []);
sexFilter.addEventListener("change", () => filter());
const sizeFilter = document.querySelector("#sizeFilter");
fillSelectWithRange(sizeFilter, SizeEnum, []);
sizeFilter.addEventListener("change", () => filter());
const ageFilter = document.querySelector("#ageFilter");
fillSelectWithRange(ageFilter, [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "15",
    "20",
    "30",
    "50",
    "100",
], [], { value: "", text: "max age" });
ageFilter.addEventListener("change", () => filter());
const compatibleWithFilter = document.querySelector("fieldset[data-bind='compatibleWithFilter']");
createChoiceWidget(compatibleWithFilter, "compatibleWithFilter", [], "checkbox", Object.values(SpeciesEnum));
compatibleWithFilter.addEventListener("change", () => filter());
const suitableWithFilter = document.querySelector("fieldset[data-bind='suitableWithFilter']");
createChoiceWidget(suitableWithFilter, "suitableWithFilter", [], "checkbox", Object.values(SuitableWithEnum));
suitableWithFilter.addEventListener("change", () => filter());
const housingFilter = document.querySelector("#housingFilter");
fillSelectWithRange(housingFilter, HousingEnum, []);
housingFilter.addEventListener("change", () => filter());
const shelterFilter = document.querySelector("#shelterFilter");
fillSelectWithEntities(shelterFilter, ShelterStorage.instances, "name", [], {
    value: "",
    text: " --- ",
});
shelterFilter.addEventListener("change", () => filter());
function filter() {
    clearTableBody();
    insertToTable((pet) => {
        if (pet.isAdopted) {
            return false;
        }
        if (speciesFilter.value !== "" && pet.species !== speciesFilter.value) {
            return false;
        }
        if (sexFilter.value !== "" && pet.sex !== sexFilter.value) {
            return false;
        }
        if (sizeFilter.value !== "" && pet.size !== sizeFilter.value) {
            return false;
        }
        if (ageFilter.value !== "" &&
            pet.birthDate.getFullYear() <
                new Date().getFullYear() - Number(ageFilter.value)) {
            return false;
        }
        const cwfAttrs = JSON.parse(compatibleWithFilter.getAttribute("data-value") ?? "[]");
        if (cwfAttrs.length > 0) {
            for (const species of cwfAttrs) {
                if (!pet.compatibleWith.includes(species)) {
                    return false;
                }
            }
        }
        const swAttrs = JSON.parse(suitableWithFilter.getAttribute("data-value") ?? "[]");
        if (swAttrs.length > 0) {
            for (const person of swAttrs) {
                if (!pet.suitableWith.includes(person)) {
                    return false;
                }
            }
        }
        if (housingFilter.value !== "" && pet.housing !== housingFilter.value) {
            return false;
        }
        if (shelterFilter.value !== "" && pet.shelterId !== shelterFilter.value) {
            return false;
        }
        return true;
    });
}
//# sourceMappingURL=filterPets.js.map