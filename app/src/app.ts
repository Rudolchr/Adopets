import {OHSlots} from "./lib/valueObjects/composed/OfficeHours.js";
import {MessageStorage} from "./messages/model/MessageStorage.js";
import {HousingEnum, PetSlots, SexEnum, SizeEnum, SpeciesEnum, SuitableWithEnum} from "./pets/model/Pet.js";
import {PetStorage} from "./pets/model/PetStorage.js";
import {ShelterSlots} from "./shelters/model/Shelter.js";
import {ShelterStorage} from "./shelters/model/ShelterStorage.js";


export async function createTestData() {
  console.log('Generating test data...');
  try {
    console.log('Creating Shelters...');
    const sheltersResponse = await fetch("../test-data/shelters.json");
    const shelters: ShelterSlots[] = await sheltersResponse.json();
    for (let shelter of shelters) {
      await ShelterStorage.add(shelter);
    }
    // await Promise.all(shelters.map(async shelter => await ShelterStorage.add(shelter)));
    console.log(`${shelters.length} shelters created.`);
  } catch (e) {
    console.warn(`${e.constructor.name}: ${e.message}`);
  }
  try {
    console.log('Creating Pets...');
    // const petsResponse = await fetch("../test-data/pets.json");
    // const pets: PetSlots[] = await petsResponse.json();
    // await Promise.all(pets.map(async pet => await PetStorage.add({...pet, shelterId: Object.keys(ShelterStorage.instances)[Number(pet.shelterId)]})));
    // console.log(`${pets.length} pets created.`);
  } catch (e) {
    console.warn(`${e.constructor.name}: ${e.message}`);
  }
}

export async function clear() {
  await Promise.all([PetStorage.clear(), ShelterStorage.clear(), MessageStorage.clear()]);
}