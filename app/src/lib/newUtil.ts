import {Entity} from "./Entity.js";
import {ValueObject} from "./valueObjects/ValueObject.js"

export function createListFromList(list: string[]) {
  const listEl = document.createElement("ul");
  for (const time of list) {
    const listItemEl = document.createElement("li");
    listItemEl.textContent = time;
    listEl.appendChild(listItemEl);
  }
  return listEl;
}

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

export function fillSelectWithEntities<E extends Entity<any>>(selection: HTMLSelectElement, entities: {[key: string]: E;}, property: keyof E, selected?: string[]){
  // delete old contents
  selection.innerHTML = "";

  // create "no selection yet" entry
  if (!selection.multiple) {
    selection.add(createOption("", " --- "));
  }
  for (const entity of Object.values(entities)) {
    const key = entity.id;
    const text = entity[property] as unknown as string;
    const option = createOption(key,text);
    option.selected = selected?.includes(key) ?? false;

    selection.add(option);
  }
}

export function fillSelectWithRange(selection: HTMLSelectElement, range: {[key: string]: string;} | string[], selected?: string[]){
  // delete old contents
  selection.innerHTML = "";

  // create "no selection yet" entry
  if (!selection.multiple) {
    selection.add(createOption("", " --- "));
  }
  const options = Array.isArray(range) ? range : Object.values(range);
  for (const text of options) {
    const option = createOption(text);
    option.selected = selected?.includes(text) ?? false;
    selection.add(option); 
  }
}

/**
 * Create a DOM option element
 *
 * @param val the option.value
 * @param txt [optional] the option.txt - will be replaced with `val` if undefined
 * @param classValues [optional] the option.className
 *
 * @return an `"option"` document element
 */
function createOption(val: string, txt?: string, classValues?: string) {
  var el = document.createElement("option");
  el.value = val;
  el.text = txt ?? val;
  if (classValues) {
    el.className = classValues;
  }

  return el;
}

/**
 * Create a choice control (radio button or checkbox) element
 *
 * @param type  The type of choice control ("radio" or "checkbox")
 * @param name  The name of the choice control input element
 * @param value  The value of the choice control input element
 * @param label  The label text of the choice control
 * @return {HTMLLabelElement}
 */
function createLabeledChoiceControl(type: 'radio' | 'checkbox', name: string, value: string, label: string) {
  const choiceEl = document.createElement("input");
  choiceEl.type = type;
  choiceEl.name = name;
  choiceEl.value = value;
  choiceEl.id = value;
  const labelEl = document.createElement("label");
  labelEl.appendChild(document.createTextNode(label));
  labelEl.htmlFor = value;
  return {choiceEl, labelEl};
}

/**
 * Create a choice widget in a given fieldset element.
 * A choice element is either an HTML radio button or an HTML checkbox.
 * @param containerEl the element (widget) containing the choices
 * @param fld the identifier of the widget
 * @param selected the initial values that are set
 * @param choiceWidgetType the type of the widget (`"radio" | "checkbox"`)
 * @param range the labels of the choices
 * @param isMandatory if true -> presets the first option
 * @returns {HTMLFieldSetElement} the modified `containerEl`, but also works without using the returned element though it is modified anyways.
 */
export function createChoiceWidget(
  containerEl: HTMLFieldSetElement,
  fld: string,
  selected: string[],
  choiceWidgetType: 'radio' | 'checkbox',
  range: string[],
  isMandatory?: boolean
) {
  const choiceControls = [...containerEl.querySelectorAll("label"), ...containerEl.querySelectorAll("input")];
  // remove old content
  for (const j of choiceControls.keys()) {
    containerEl.removeChild(choiceControls[j]);
  }
  if (!containerEl.hasAttribute("data-bind")) {
    containerEl.setAttribute("data-bind", fld);
  }
  // for a mandatory radio button group initialize to first value
  if (choiceWidgetType === "radio" && isMandatory && selected.length === 0) {
    selected[0] = range[0];
  }
  if (selected.length >= 1) {
      containerEl.setAttribute("data-value", JSON.stringify(selected));
  }
  // button values = 1..n
  for (const entry of range) {
    const {choiceEl, labelEl} = createLabeledChoiceControl(
      choiceWidgetType,
      fld,
      entry,
      entry
    );
    // mark the radio button or checkbox as selected/checked
    if (selected.includes(entry)) {
      choiceEl.checked = true;
    }
    containerEl.appendChild(choiceEl);
    containerEl.appendChild(labelEl);
    choiceEl.addEventListener("click", (e) => {
      const btnEl: HTMLInputElement = e.target as HTMLInputElement;
      if (choiceWidgetType === "radio") {
        if (containerEl.getAttribute("data-value") !== btnEl.value) {
          containerEl.setAttribute("data-value", JSON.stringify([btnEl.value]));
        } else if (!isMandatory) {
          // turn off radio button
          btnEl.checked = false;
          containerEl.setAttribute("data-value", "[]");
        }
      } else {
        // checkbox
        const existing: string[] = JSON.parse(containerEl.getAttribute("data-value") ?? "[]");
        const i = existing.indexOf(btnEl.value);
        if (i > -1) {
          existing.splice(i, 1); // delete from value list
        } else {
          // add to value list
          existing.push(btnEl.value);
        }
        containerEl.setAttribute("data-value", JSON.stringify(existing));
      }
    });
  }
  return containerEl;
}