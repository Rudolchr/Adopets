import { Address } from "../lib/valueObjects/composed/Address.js";
import {SpeciesEnum} from "../m/Pet.js";
import {PetStorage} from "../m/PetStorage.js";
import {ShelterStorage} from "../m/ShelterStorage.js";



/**
 * creates a set of 4 `Pet`s and stores it in the first 4 slots of the `this.instances`
 * - TODO: upgrade to always push new pets (requires ID automation)
 */
export async function createTestData() {
    // create shelters
    try {
        await ShelterStorage.add({name: 'Pet Stop', city: 'Düsseldog', number: 69, street: 'Am Catdog', email: 'pet@stop.com', officeHours: 'open', phone: '+1234567890'})
        await ShelterStorage.add({name: 'Pussy Willow', city: 'Catbus', number: 13, street: 'Dingsda', email: 'cat@bus.com', officeHours: 'closed', phone: '+0345617829'})
        await ShelterStorage.add({name: 'Cerberus', city: 'Bärlin', number: 17, street: 'Kuhdamm', email: 'bär@damm.com', officeHours: 'unknown', phone: '+5601432897'})
    } catch (e) {
        console.warn(`${e.constructor.name}: ${e.message}`);
    }
    // create pets
    const shelterId = Object.keys(ShelterStorage.instances)[0];
    try {
        await PetStorage.add({name: "Wolfgang", species: SpeciesEnum.DOG, birthDate: "2020-05-09", shelterId});
        await PetStorage.add({name: "Hundula", species: SpeciesEnum.DOG, birthDate: "2019-07-22", shelterId});
        await PetStorage.add({name: "Katzarina", species: SpeciesEnum.CAT, birthDate: "2012-11-14", shelterId});
        await PetStorage.add({name: "Vogeldemort", species: SpeciesEnum.BIRD, birthDate: "2001-06-08", shelterId});
    } catch (e) {
        console.warn(`${e.constructor.name}: ${e.message}`);
    }
}

export async function clear() {
    await Promise.all([PetStorage.clear(), ShelterStorage.clear()]);
}