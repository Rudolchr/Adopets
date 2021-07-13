/**
 * runs the given `validationFunction` and returns the given `errorMessage` if the function throws an Error - which will be also logged to `console.error`.
 * Returns an empty string otherwise.
 * @param validationFunction to run 
 * @param errorMessage to show if the `validationFunction` throws an Error
 * @returns the given `errorMessage` if the `validationFunction` throws an Error. Returns `""` otherwise
 */
export function catchValidation(validationFunction: () => any, errorMessage: string) {
  try {
    validationFunction();
    return "";
  } catch (error) {
    console.error(error);
    return errorMessage;
  }
}
/**
 * runs the given `validationFunction` and returns the given `errorMessage` if the function throws an Error - which will be also logged to `console.error`.
 * Returns an empty string otherwise.
 * @param values that will be iterated and checked with the function 
 * @param validationFunction to run 
 * @param errorMessage to show if the `validationFunction` throws an Error
 * @returns the given `errorMessage` if the `validationFunction` throws an Error. Returns `""` otherwise
 */
export function catchValidations<T>(values: T[], validationFunction: (value: T) => any, errorMessage: string) {
  try {
    for (const value of values) {
      validationFunction(value);
    }
    return "";
  } catch (error) {
    console.error(error);
    return errorMessage;
  }
}

export function GetURLParameter(sParam: string) {
  var sPageURL = window.location.search.substring(1);
  var sURLVariables = sPageURL.split('&');
  for (const sParamName of sURLVariables) {
    var sParameterName = sParamName.split('=');
    if (sParameterName[0] == sParam) {
      return sParameterName[1];
    }
  }
}

export function handleUserMessage(
  status: string, 
  data: firebase.firestore.DocumentData | firebase.firestore.DocumentSnapshot | firebase.firestore.SnapshotOptions | undefined
  ) {
  const userMessageContainerEl: HTMLElement |  null = document.querySelector(".user-message");
  const errorMessage = userMessageContainerEl?.querySelector("div");
  const buttonEl = document.createElement("button");
  let msgText = `The selected entry has been ${status}. Please reload this page to continue!`;

  if (userMessageContainerEl && errorMessage) {
    userMessageContainerEl.innerHTML = "";
    errorMessage.textContent = msgText;

    buttonEl.setAttribute("type", "button");
    buttonEl.textContent = "Reload";

    errorMessage?.appendChild( buttonEl);
    userMessageContainerEl?.appendChild( errorMessage);
    userMessageContainerEl.hidden = false;
  }

  buttonEl.addEventListener("click", () => {
    location.reload();
  })
}
