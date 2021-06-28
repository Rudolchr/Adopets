/**
 * runs the given `validationFunction` and returns the given `errorMessage` if the function throws an Error - which will be also logged to `console.error`.
 * Returns an empty string otherwise.
 * @param validationFunction to run
 * @param errorMessage to show if the `validationFunction` throws an Error
 * @returns the given `errorMessage` if the `validationFunction` throws an Error. Returns `""` otherwise
 */
export function catchValidation(validationFunction, errorMessage) {
    try {
        validationFunction();
        return "";
    }
    catch (error) {
        console.error(error);
        return errorMessage;
    }
}
export function fillSelectWithEntities(selection, entities, property) {
    // delete old contents
    selection.innerHTML = "";
    // create "no selection yet" entry
    if (!selection.multiple) {
        selection.add(createOption("", " --- "));
    }
    for (const entity of Object.values(entities)) {
        const key = entity.id;
        const text = entity[property];
        const option = createOption(key, text);
        selection.add(option);
    }
}
export function fillSelectWithRange(selection, range, selected) {
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
function createOption(val, txt, classValues) {
    var el = document.createElement("option");
    el.value = val;
    el.text = txt ?? val;
    if (classValues) {
        el.className = classValues;
    }
    return el;
}
//# sourceMappingURL=newUtil.js.map