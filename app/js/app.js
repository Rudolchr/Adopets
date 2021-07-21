import { MessageStorage } from "./messages/model/MessageStorage.js";
import { PetStorage } from "./pets/model/PetStorage.js";
import { ShelterStorage } from "./shelters/model/ShelterStorage.js";
export async function createTestData() {
    console.info('Generating test data...');
    try {
        console.info('Creating Shelters...');
        const sheltersResponse = await fetch("../test-data/shelters.json");
        const shelters = await sheltersResponse.json();
        for (let shelter of shelters) {
            await ShelterStorage.add(shelter);
        }
        // await Promise.all(shelters.map(async shelter => await ShelterStorage.add(shelter)));
        console.info(`${shelters.length} shelters created.`);
    }
    catch (e) {
        console.warn(`${e.constructor.name}: ${e.message}`);
    }
    try {
        console.info('Creating Pets...');
        const petsResponse = await fetch("../test-data/pets.json");
        const pets = await petsResponse.json();
        await Promise.all(pets.map(async (pet) => await PetStorage.add({ ...pet, shelterId: Object.keys(ShelterStorage.instances)[Number(pet.shelterId)] })));
        console.info(`${pets.length} pets created.`);
    }
    catch (e) {
        console.warn(`${e.constructor.name}: ${e.message}`);
    }
}
export async function clear() {
    await Promise.all([PetStorage.clear(), ShelterStorage.clear(), MessageStorage.clear()]);
}
//# sourceMappingURL=app.js.map