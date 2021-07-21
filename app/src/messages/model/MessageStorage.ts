import { AbstractStorage } from "../../lib/Storage.js";
import { Message, MessageSlots } from "./Message.js";

/**
 * internal
 */
class MessageStorageClass extends AbstractStorage<Message, MessageSlots> {
  /** key for the `firestore.collection` for the `this.instances` */
  STORAGE_KEY = "messages";

  retrieveAllFromUser(shelterIds: string[]) {
    let return_instances: { [id: string]: Message } = {};

    for (const message of Object.values(this._instances)) {
      for (let id of shelterIds) {
        if (id === message.shelterId) {
          return_instances[message.id] = message;
        }
      }
    }

    return return_instances;
  }

  async destroyShelterRefs(shelterId: string) {
    for (const msg of Object.values(this._instances)) {
      if (msg.shelterId === shelterId) {
        this.destroy(msg.id);
      }
    }
  }

  /**
   * adds a new Message created from the given `slots` to the collection of `Message`s
   * if the slots fulfil their constraints. Does nothing otherwise
   */
  async add(slots: Omit<MessageSlots, "id">) {
    await super.addWithConstructor(Message, slots);
  }

  /**
   * loads all stored Messages from the `firestore`, parses them and stores them
   * to the `this.instances`
   */
  async retrieveAll() {
    await super.retrieveAllWithConstructor(Message);
  }

  /**
   * updates the `Message` with the corresponding `slots.id` and overwrites it's props if new
   */
  async update(slots: MessageSlots) {
    await super.updateWithConstructor(Message, slots);
  }

  async destroy(id: string) {
    await super.destroy(id);
  }

  async clear() {
    await super.clear();
  }
}

/**
 * a singleton instance of the `MessageStorage`.
 * - provides functions to create, retrieve, update and destroy `Message`s at the `firestore`
 * - additionally provides auxiliary methods for testing
 */
export const MessageStorage = new MessageStorageClass();
