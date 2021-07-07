import { FormFactory } from "../../lib/forms/FormFactory.js";
import { GetURLParameter } from "../../lib/newUtil.js";
import { Message } from "../model/Message.js";
import { MessageStorage } from "../model/MessageStorage.js";
// we use the factory to create the view logic for the Form
const formFactory = new FormFactory("Message");
// which elements should be manipulated with this Form
const formElements = {
    //   id: formFactory.createOutput("messageId"), // doesn't exist though not necessary
    message: formFactory.createInput("message", Message.checkMessage),
    shelterId: formFactory.createOutput("shelterId"),
    petId: formFactory.createOutput("petId"),
    senderEmail: formFactory.createInput("senderEmail", Message.checkSenderEmail),
    senderPhoneNo: formFactory.createInput("senderPhoneNo", Message.checkSenderPhoneNo),
};
console.log(GetURLParameter('shelterId'));
// set url params
formElements.shelterId.set(GetURLParameter('shelterId'));
formElements.petId.set(GetURLParameter('petId'));
// send button
formFactory.createSubmitButton('sendButton', formElements, (slots) => MessageStorage.add(slots));
//# sourceMappingURL=writeMessage.js.map