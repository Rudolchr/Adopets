import {OHSlots} from "./lib/valueObjects/composed/OfficeHours.js";
import {HousingEnum, SexEnum, SizeEnum, SpeciesEnum, SuitableWithEnum} from "./pets/model/Pet.js";
import {PetStorage} from "./pets/model/PetStorage.js";
import {ShelterStorage} from "./shelters/model/ShelterStorage.js";
import {UserStorage} from "./user/model/UserStorage.js";

/**
 * creates a set of 4 `Pet`s and stores it in the first 4 slots of the `this.instances`
 * - TODO: upgrade to always push new pets (requires ID automation)
 */
export async function createTestData() {
    const oh: OHSlots = {
        monday: ["08:00", "20:00"],
        tuesday: ["08:00", "20:00"],
        wednesday: ["08:00", "20:00"],
        thursday: ["08:00", "20:00"],
        friday: ["08:00", "20:00"],
        saturday: ["", ""],
        sunday: ["", ""],
    };

    // create shelters
    try {
        await ShelterStorage.add({name: 'Pet Stop', address: {city: 'Düsseldog', number: 69, street: 'Am Catdog'}, email: 'pet@stop.com', officeHours: oh, phone: '+1234567890', creatorId: "XmdTK2Ad7ScBDviC0KKE2nvVBma2"});
        await ShelterStorage.add({name: 'Pussy Willow', address: {city: 'Catbus', number: 13, street: 'Dingsda'}, email: 'cat@bus.com', officeHours: oh, phone: '+0345617829', creatorId: "XmdTK2Ad7ScBDviC0KKE2nvVBma2"});
        await ShelterStorage.add({name: 'Cerberus', address: {city: 'Bärlin', number: 17, street: 'Kuhdamm'}, email: 'bär@damm.com', officeHours: oh, phone: '+5601432897', creatorId: "XmdTK2Ad7ScBDviC0KKE2nvVBma2"});
    } catch (e) {
        console.warn(`${e.constructor.name}: ${e.message}`);
    }
    // create pets
    const shelterId = Object.keys(ShelterStorage.instances)[0];
    try {
        await PetStorage.add({
            name: "Wolfgang", 
            species: SpeciesEnum.DOG, 
            sex: SexEnum.MALE, 
            size: SizeEnum.VERY_LARGE, 
            birthDate: "2020-05-09", 
            vaccinationStatus: 'immortal', 
            compatibleWith: [], 
            suitableWith: [], 
            housing: HousingEnum.OUTDOOR_REQUIRED, 
            isAdopted: false, 
            shelterId,
            creatorId: "XmdTK2Ad7ScBDviC0KKE2nvVBma2"});
        await PetStorage.add({
            name: "Hundula", 
            species: SpeciesEnum.DOG, 
            sex: SexEnum.FEMALE, 
            size: SizeEnum.SMALL, 
            birthDate: "2019-07-22", 
            vaccinationStatus: 'full of vax', 
            compatibleWith: [SpeciesEnum.BIRD,SpeciesEnum.CAT,SpeciesEnum.BIRD], 
            suitableWith: [SuitableWithEnum.CHILDREN,SuitableWithEnum.SENIORS], 
            housing: HousingEnum.IN_AND_OUT, 
            isAdopted: false, 
            shelterId,
            creatorId: "XmdTK2Ad7ScBDviC0KKE2nvVBma2"});
        await PetStorage.add({
            name: "Katzarina", 
            species: SpeciesEnum.CAT, 
            sex: SexEnum.FEMALE, 
            size: SizeEnum.MEDIUM, 
            birthDate: "2012-11-14", 
            vaccinationStatus: 'not necessary', 
            compatibleWith: [SpeciesEnum.BIRD], 
            suitableWith: [SuitableWithEnum.SENIORS], 
            housing: HousingEnum.INDOOR_ONLY, 
            isAdopted: false, 
            shelterId,
            creatorId: "XmdTK2Ad7ScBDviC0KKE2nvVBma2"});
        await PetStorage.add({
            name: "Vogeldemort", 
            species: SpeciesEnum.BIRD, 
            sex: SexEnum.UNKNOWN, 
            size: SizeEnum.SMALL, 
            birthDate: "2001-06-08", 
            vaccinationStatus: 'what vaccinations?', 
            compatibleWith: [SpeciesEnum.BIRD], 
            suitableWith: [SuitableWithEnum.CHILDREN], 
            housing: HousingEnum.INDOOR_ONLY, 
            isAdopted: false, 
            shelterId,
            creatorId: "XmdTK2Ad7ScBDviC0KKE2nvVBma2"});
    } catch (e) {
        console.warn(`${e.constructor.name}: ${e.message}`);
    }

    try {
        await UserStorage.add({
            email: "test@test.test",
            shelters: [],
            pets: []
        });
    } catch (e) {
        console.warn(`${e.constructor.name}: ${e.message}`);
    }
}

export async function clear() {
    await Promise.all([PetStorage.clear(), ShelterStorage.clear(), UserStorage.clear()]);
}