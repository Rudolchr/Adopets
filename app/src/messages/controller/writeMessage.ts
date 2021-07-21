import {FormElementBase, FormFactory} from "../../lib/forms/FormFactory.js";
import {GetURLParameter} from "../../lib/newUtil.js";
import {Message, MessageSlots} from "../model/Message.js";
import {MessageStorage} from "../model/MessageStorage.js";

// we use the factory to create the view logic for the Form
const formFactory = new FormFactory("Message");

// which elements should be manipulated with this Form
const formElements: Record<keyof Omit<MessageSlots, 'id'>, FormElementBase> = {
    //   id: formFactory.createOutput("messageId"), // doesn't exist though not necessary
    message: formFactory.createInput("message", Message.checkMessage),
    shelterId: formFactory.createOutput("shelterId"),
    petId: formFactory.createOutput("petId"),
    senderEmail: formFactory.createInput("senderEmail", Message.checkSenderEmail),
    senderPhoneNo: formFactory.createInput("senderPhoneNo", Message.checkSenderPhoneNo),
};

// set url params
formElements.shelterId.set(GetURLParameter('shelterId'));
formElements.petId.set(GetURLParameter('petId'));

if (auth.currentUser?.email) {
    formElements.senderEmail.set(auth.currentUser.email);
}

// send button
formFactory.createSubmitButton<Omit<MessageSlots, 'id'>, Message>(
    'sendButton',
    formElements,
    (slots) => MessageStorage.add(slots),
);
