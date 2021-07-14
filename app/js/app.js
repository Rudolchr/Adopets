import { MessageStorage } from "./messages/model/MessageStorage.js";
import { HousingEnum, SexEnum, SizeEnum, SpeciesEnum, SuitableWithEnum } from "./pets/model/Pet.js";
import { PetStorage } from "./pets/model/PetStorage.js";
import { ShelterStorage } from "./shelters/model/ShelterStorage.js";
export async function createTestData() {
    console.log('Generating test data...');
    try {
        console.log('Creating Shelters...');
        const sheltersResponse = await fetch("../test-data/shelters.json");
        const shelters = await sheltersResponse.json();
        await Promise.all(shelters.map(async (shelter) => await ShelterStorage.add(shelter)));
        console.log(`${shelters.length} shelters created.`);
    }
    catch (e) {
        console.warn(`${e.constructor.name}: ${e.message}`);
    }
    try {
        console.log('Creating Pets...');
        const petsResponse = await fetch("../test-data/pets.json");
        const pets = await petsResponse.json();
        await Promise.all(pets.map(async (pet) => await PetStorage.add({ ...pet, shelterId: Object.keys(ShelterStorage.instances)[Number(pet.shelterId)] })));
        console.log(`${pets.length} pets created.`);
    }
    catch (e) {
        console.warn(`${e.constructor.name}: ${e.message}`);
    }
}
/**
 * creates a set of 4 `Pet`s and stores it in the first 4 slots of the `this.instances`
 * - TODO: upgrade to always push new pets (requires ID automation)
 */
export async function createTestData_OLD() {
    const oh = {
        monday: ["08:00", "20:00"],
        tuesday: ["08:00", "20:00"],
        wednesday: ["08:00", "20:00"],
        thursday: ["08:00", "20:00"],
        friday: ["08:00", "20:00"],
        saturday: ["", ""],
        sunday: ["", ""],
    };
    const creatorId = "NozVU7hxEZaD0PWOSff2XeMQ43m1"; // prinzach@b-tu.de
    const creatorId2 = "XmdTK2Ad7ScBDviC0KKE2nvVBma2"; // max.bergmann@b-tu.de
    // create shelters
    try {
        await ShelterStorage.add({ name: 'Pet Stop', address: { city: 'Düsseldog', number: 69, street: 'Am Catdog' }, email: 'pet@stop.com', officeHours: oh, phone: '+1234567890', creatorId });
        await ShelterStorage.add({ name: 'Pussy Willow', address: { city: 'Catbus', number: 13, street: 'Dingsda' }, email: 'cat@bus.com', officeHours: oh, phone: '+0345617829', creatorId });
        await ShelterStorage.add({ name: 'Cerberus', address: { city: 'Bärlin', number: 17, street: 'Kuhdamm' }, email: 'bär@damm.com', officeHours: oh, phone: '+5601432897', creatorId });
        await ShelterStorage.add({ name: 'Birds Birds Birds', address: { city: 'Vogland', number: 99, street: 'Flugschneise' }, email: 'birds@birds.de', officeHours: oh, phone: '+9475149701', creatorId });
    }
    catch (e) {
        console.warn(`${e.constructor.name}: ${e.message}`);
    }
    // create pets
    const shelters = Object.keys(ShelterStorage.instances);
    try {
        // DOGS
        await PetStorage.add({
            name: "Wolfgang",
            species: SpeciesEnum.DOG,
            sex: SexEnum.MALE,
            size: SizeEnum.VERY_LARGE,
            birthDate: "1995-05-09",
            vaccinationStatus: 'immortal',
            compatibleWith: [],
            suitableWith: [],
            housing: HousingEnum.OUTDOOR_REQUIRED,
            isAdopted: false,
            shelterId: shelters[0],
            creatorId,
        });
        await PetStorage.add({
            name: "Hundula",
            species: SpeciesEnum.DOG,
            sex: SexEnum.FEMALE,
            size: SizeEnum.LARGE,
            birthDate: "2004-07-22",
            vaccinationStatus: 'vaxed',
            compatibleWith: [SpeciesEnum.DOG, SpeciesEnum.CAT, SpeciesEnum.BIRD],
            suitableWith: [SuitableWithEnum.CHILDREN, SuitableWithEnum.SENIORS],
            housing: HousingEnum.OUTDOOR_REQUIRED,
            isAdopted: false,
            shelterId: shelters[1],
            creatorId,
        });
        await PetStorage.add({
            name: "Hundter",
            species: SpeciesEnum.DOG,
            sex: SexEnum.UNKNOWN,
            size: SizeEnum.SMALL,
            birthDate: "2021-07-05",
            vaccinationStatus: 'not yet',
            compatibleWith: [SpeciesEnum.BIRD, SpeciesEnum.CAT],
            suitableWith: [SuitableWithEnum.SENIORS],
            housing: HousingEnum.IN_AND_OUT,
            isAdopted: false,
            shelterId: shelters[2],
            creatorId,
        });
        await PetStorage.add({
            name: "Hundter II.",
            species: SpeciesEnum.DOG,
            sex: SexEnum.UNKNOWN,
            size: SizeEnum.SMALL,
            birthDate: "2021-07-05",
            vaccinationStatus: 'yes',
            compatibleWith: [SpeciesEnum.BIRD, SpeciesEnum.CAT],
            suitableWith: [SuitableWithEnum.SENIORS],
            housing: HousingEnum.IN_AND_OUT,
            isAdopted: true,
            shelterId: shelters[2],
            creatorId,
        });
        await PetStorage.add({
            name: "Hundter III.",
            species: SpeciesEnum.DOG,
            sex: SexEnum.UNKNOWN,
            size: SizeEnum.SMALL,
            birthDate: "2021-07-05",
            vaccinationStatus: 'yes',
            compatibleWith: [SpeciesEnum.BIRD, SpeciesEnum.CAT],
            suitableWith: [SuitableWithEnum.SENIORS],
            housing: HousingEnum.IN_AND_OUT,
            isAdopted: true,
            shelterId: shelters[2],
            creatorId,
        });
        await PetStorage.add({
            name: "Hei Zung",
            species: SpeciesEnum.DOG,
            sex: SexEnum.MALE,
            size: SizeEnum.MEDIUM,
            birthDate: "2019-07-22",
            vaccinationStatus: 'vaxed',
            compatibleWith: [SpeciesEnum.DOG, SpeciesEnum.CAT],
            suitableWith: [SuitableWithEnum.CHILDREN],
            housing: HousingEnum.IN_AND_OUT,
            isAdopted: true,
            shelterId: shelters[3],
            creatorId,
        });
        // CATS
        await PetStorage.add({
            name: "Katzarina",
            species: SpeciesEnum.CAT,
            sex: SexEnum.FEMALE,
            size: SizeEnum.MEDIUM,
            birthDate: "2002-02-02",
            vaccinationStatus: 'vaxed',
            compatibleWith: [SpeciesEnum.DOG, SpeciesEnum.CAT, SpeciesEnum.BIRD],
            suitableWith: [SuitableWithEnum.CHILDREN, SuitableWithEnum.SENIORS],
            housing: HousingEnum.INDOOR_ONLY,
            isAdopted: false,
            shelterId: shelters[0],
            creatorId,
        });
        await PetStorage.add({
            name: "Kaatsten",
            species: SpeciesEnum.CAT,
            sex: SexEnum.MALE,
            size: SizeEnum.LARGE,
            birthDate: "2012-04-24",
            vaccinationStatus: 'vaxed',
            compatibleWith: [SpeciesEnum.DOG, SpeciesEnum.CAT],
            suitableWith: [SuitableWithEnum.SENIORS],
            housing: HousingEnum.IN_AND_OUT,
            isAdopted: false,
            shelterId: shelters[3],
            creatorId,
        });
        await PetStorage.add({
            name: "Mietzi",
            species: SpeciesEnum.CAT,
            sex: SexEnum.UNKNOWN,
            size: SizeEnum.SMALL,
            birthDate: "2021-06-30",
            vaccinationStatus: 'not necessary',
            compatibleWith: [SpeciesEnum.DOG],
            suitableWith: [SuitableWithEnum.CHILDREN, SuitableWithEnum.SENIORS],
            housing: HousingEnum.INDOOR_ONLY,
            isAdopted: false,
            shelterId: shelters[2],
            creatorId,
        });
        await PetStorage.add({
            name: "Katzjana",
            species: SpeciesEnum.CAT,
            sex: SexEnum.FEMALE,
            size: SizeEnum.MEDIUM,
            birthDate: "2011-05-03",
            vaccinationStatus: 'not necessary',
            compatibleWith: [SpeciesEnum.CAT, SpeciesEnum.BIRD],
            suitableWith: [SuitableWithEnum.CHILDREN],
            housing: HousingEnum.IN_AND_OUT,
            isAdopted: true,
            shelterId: shelters[1],
            creatorId,
        });
        await PetStorage.add({
            name: "Catherine",
            species: SpeciesEnum.CAT,
            sex: SexEnum.FEMALE,
            size: SizeEnum.MEDIUM,
            birthDate: "2019-11-11",
            vaccinationStatus: 'not necessary',
            compatibleWith: [SpeciesEnum.CAT, SpeciesEnum.BIRD],
            suitableWith: [SuitableWithEnum.CHILDREN],
            housing: HousingEnum.IN_AND_OUT,
            isAdopted: false,
            shelterId: shelters[1],
            creatorId,
        });
        await PetStorage.add({
            name: "Catherine's Schwester",
            species: SpeciesEnum.CAT,
            sex: SexEnum.FEMALE,
            size: SizeEnum.MEDIUM,
            birthDate: "2017-01-14",
            vaccinationStatus: 'not necessary',
            compatibleWith: [SpeciesEnum.CAT, SpeciesEnum.BIRD],
            suitableWith: [SuitableWithEnum.CHILDREN],
            housing: HousingEnum.IN_AND_OUT,
            isAdopted: false,
            shelterId: shelters[1],
            creatorId,
        });
        await PetStorage.add({
            name: "Catherine's Bruder",
            species: SpeciesEnum.CAT,
            sex: SexEnum.MALE,
            size: SizeEnum.MEDIUM,
            birthDate: "2018-11-14",
            vaccinationStatus: 'not necessary',
            compatibleWith: [SpeciesEnum.CAT, SpeciesEnum.BIRD],
            suitableWith: [SuitableWithEnum.CHILDREN],
            housing: HousingEnum.IN_AND_OUT,
            isAdopted: true,
            shelterId: shelters[1],
            creatorId,
        });
        // BIRDS
        await PetStorage.add({
            name: "Voglker",
            species: SpeciesEnum.BIRD,
            sex: SexEnum.FEMALE,
            size: SizeEnum.SMALL,
            birthDate: "2018-03-26",
            vaccinationStatus: 'vaxed',
            compatibleWith: [SpeciesEnum.DOG, SpeciesEnum.CAT, SpeciesEnum.BIRD],
            suitableWith: [SuitableWithEnum.CHILDREN, SuitableWithEnum.SENIORS],
            housing: HousingEnum.INDOOR_ONLY,
            isAdopted: false,
            shelterId: shelters[0],
            creatorId,
        });
        await PetStorage.add({
            name: "Piep Matze",
            species: SpeciesEnum.BIRD,
            sex: SexEnum.MALE,
            size: SizeEnum.SMALL,
            birthDate: "2020-05-18",
            vaccinationStatus: 'vaxed',
            compatibleWith: [SpeciesEnum.DOG, SpeciesEnum.BIRD],
            suitableWith: [SuitableWithEnum.SENIORS],
            housing: HousingEnum.IN_AND_OUT,
            isAdopted: false,
            shelterId: shelters[3],
            creatorId,
        });
        await PetStorage.add({
            name: "Vogeldemort",
            species: SpeciesEnum.BIRD,
            sex: SexEnum.UNKNOWN,
            size: SizeEnum.SMALL,
            birthDate: "1990-01-01",
            vaccinationStatus: 'what vaccinations?',
            compatibleWith: [SpeciesEnum.BIRD],
            suitableWith: [SuitableWithEnum.CHILDREN],
            housing: HousingEnum.INDOOR_ONLY,
            isAdopted: false,
            shelterId: shelters[1],
            creatorId,
        });
        await PetStorage.add({
            name: "Pieper Parker",
            species: SpeciesEnum.BIRD,
            sex: SexEnum.UNKNOWN,
            size: SizeEnum.MEDIUM,
            birthDate: "2019-11-14",
            vaccinationStatus: 'not necessary',
            compatibleWith: [SpeciesEnum.CAT, SpeciesEnum.BIRD],
            suitableWith: [SuitableWithEnum.CHILDREN],
            housing: HousingEnum.IN_AND_OUT,
            isAdopted: true,
            shelterId: shelters[0],
            creatorId,
        });
    }
    catch (e) {
        console.warn(`${e.constructor.name}: ${e.message}`);
    }
}
export async function clear() {
    await Promise.all([PetStorage.clear(), ShelterStorage.clear(), MessageStorage.clear()]);
}
//# sourceMappingURL=app.js.map