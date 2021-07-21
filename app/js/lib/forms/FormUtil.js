export function fillSelectWithEntities(selection, entities, property, selected, emptyOption = {
    value: "",
    text: " -- create -- ",
}) {
    // delete old contents
    selection.innerHTML = "";
    // create "no selection yet" entry
    if (!selection.multiple) {
        selection.add(createOption(emptyOption.value, emptyOption.text));
    }
    for (const entity of Object.values(entities)) {
        const key = entity.id;
        const text = entity[property];
        const option = createOption(key, text);
        option.selected = selected?.includes(key) ?? false;
        selection.add(option);
    }
}
export function fillSelectWithRange(selection, range, selected, emptyOption = { value: "", text: " --- " }) {
    // delete old contents
    selection.innerHTML = "";
    // create "no selection yet" entry
    if (!selection.multiple) {
        selection.add(createOption(emptyOption.value, emptyOption.text));
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
export function createOption(val, txt, classValues) {
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
function createLabeledChoiceControl(type, name, value, label) {
    const choiceEl = document.createElement("input");
    choiceEl.type = type;
    choiceEl.name = name;
    choiceEl.value = value;
    choiceEl.id = value;
    const labelEl = document.createElement("label");
    labelEl.appendChild(document.createTextNode(label));
    labelEl.htmlFor = value;
    return { choiceEl, labelEl };
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
export function createChoiceWidget(containerEl, fld, selected, choiceWidgetType, range, isMandatory) {
    const choiceControls = [
        ...containerEl.querySelectorAll("label"),
        ...containerEl.querySelectorAll("input"),
    ];
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
        const { choiceEl, labelEl } = createLabeledChoiceControl(choiceWidgetType, fld, entry, entry);
        // mark the radio button or checkbox as selected/checked
        if (selected.includes(entry)) {
            choiceEl.checked = true;
        }
        containerEl.appendChild(choiceEl);
        containerEl.appendChild(labelEl);
        choiceEl.addEventListener("click", (e) => {
            const btnEl = e.target;
            if (choiceWidgetType === "radio") {
                if (containerEl.getAttribute("data-value") !== btnEl.value) {
                    containerEl.setAttribute("data-value", JSON.stringify([btnEl.value]));
                }
                else if (!isMandatory) {
                    // turn off radio button
                    btnEl.checked = false;
                    containerEl.setAttribute("data-value", "[]");
                }
            }
            else {
                // checkbox
                const existing = JSON.parse(containerEl.getAttribute("data-value") ?? "[]");
                const i = existing.indexOf(btnEl.value);
                if (i > -1) {
                    existing.splice(i, 1); // delete from value list
                }
                else {
                    // add to value list
                    existing.push(btnEl.value);
                }
                containerEl.setAttribute("data-value", JSON.stringify(existing));
            }
        });
    }
    return containerEl;
}
export function createListFromList(list) {
    const listEl = document.createElement("ul");
    for (const time of list) {
        const listItemEl = document.createElement("li");
        listItemEl.textContent = time;
        listEl.appendChild(listItemEl);
    }
    return listEl;
}
//# sourceMappingURL=FormUtil.js.map