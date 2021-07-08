import { createChoiceWidget, fillSelectWithEntities, fillSelectWithRange } from "./FormUtil.js";
export class FormFactory {
    _form;
    /**
     * ### What is the FormFactory
     * The `FormFactory` can be used to optionally create the UI logic for predefined HTML Forms.
     * The Form and its components have to be declared in HTML before. Every `HTMLFormElement`
     * (including) the Form itself must have an id that will be referenced by creation
     *
     * ### How does it work
     * - At first the Factory must be instantiated with `const ff = new FormFactory(id)`
     * - Then the Elements for the Form can be created with `ff.createXYZ()`. There are several
     *   Elements like `Input` or `Selection` available. All of them require different Properties
     * - It's recommended to declare them in a separate Object of type `{slotKey: FormElement}`
     *   where the `slotKey` is is one of the keys for the manipulation of an Entity like this:
     *   ```typescript
     *   const elements = {
     *     lastName: ff.createInput('lastName', Person.checkLastName),
     *     ...
     *   }
     *   ```
     * - It's possible to create an EntitySelection with the defined form elements. this selection
     *   will then manipulate the form elements with the selected entity's properties
     * - It's also possible to create a SubmitButton with the form elements which will again
     *   validate the values and return them in a callback
     *
     * For further information look at the jsdoc of the several elements.
     *
     * @param id of the HTMLForm
     * @param neutralize should the form be reset after submission
     */
    constructor(id, neutralize = true) {
        this._form = document.forms.namedItem(id);
        if (neutralize) {
            // neutralize the submit event
            this.form.addEventListener("submit", (e) => {
                e.preventDefault();
                this.form.reset();
            });
        }
    }
    get form() {
        return this._form;
    }
    /**
     * creates an OutputElement and returns accessing functions
     * @param id of the HTMLOutputElement
     * @returns `get()`, `set(value: string)` and a *disabled* `check()`
     */
    createOutput(id) {
        const output = this._form[id];
        function get() {
            return output.value;
        }
        function set(value) {
            output.value = typeof value === 'string' ? value : value.toString();
        }
        function check() { }
        return { get, set, check };
    }
    /**
     * creates an InputElement and returns accessing functions
     * @param id of the HTMLInputElement
     * @param validationFunction which checks if the value is correct
     * @returns `get()`, `set(value: string)` and a `check()` that validates the current value
     */
    createInput(id, validationFunction) {
        const input = this._form[id];
        function check() {
            input.setCustomValidity(validationFunction(input.value));
        }
        function get() {
            return input.value;
        }
        function set(value) {
            if (typeof value === 'string') {
                input.value = value;
            }
            else if (typeof value === 'number') {
                input.valueAsNumber = value;
            }
            else {
                input.valueAsDate = value;
            }
        }
        input.addEventListener("input", () => check());
        return { get, set, check };
    }
    /**
     * creates a SelectionElement to reference foreign entities and returns accessing functions
     * @param id of the HTMLSelectElement
     * @param validationFunction which checks if the value is correct
     * @param entities that can be referenced
     * @param referenceDisplayProp a property of an entity that will be displayed
     * @param selected [optional] the entity / entities that are previously selected
     * @returns `get()`, `set(value: string)` and a `check()` that validates the current value
     */
    createReferenceSelection(id, validationFunction, entities, referenceDisplayProp, selected) {
        const selection = this._form[id];
        fillSelectWithEntities(selection, entities, referenceDisplayProp, selected);
        function check() {
            selection.setCustomValidity(validationFunction(selection.value));
        }
        function get() {
            return selection.value;
        }
        function set(value) {
            fillSelectWithEntities(selection, entities, referenceDisplayProp, [value]);
        }
        selection.addEventListener("change", () => check());
        return { get, set, check };
    }
    /**
     * creates a SelectionElement for enumerations and returns accessing functions
     * @param id of the HTMLSelectElement
     * @param validationFunction which checks if the value is correct
     * @param range an `enum` or `string[]` with the possible values
     * @param selected [optional] the values that are previously selected
     * @returns `get()`, `set(value: string)` and a `check()` that validates the current value
     */
    createRangeSelection(id, validationFunction, range, selected) {
        const selection = this._form[id];
        fillSelectWithRange(selection, range, selected);
        function check() {
            selection.setCustomValidity(validationFunction(selection.value));
        }
        function get() {
            return selection.value;
        }
        function set(value) {
            fillSelectWithRange(selection, range, [value]);
        }
        selection.addEventListener("change", () => check());
        return { get, set, check };
    }
    /**
     * creates a FieldSetElement for enumerations with radioButtons or checkBoxed and returns accessing functions
     * @param id of the HTMLFieldSetElement
     * @param validationFunction which checks if the values are correct
     * @param type `'radio'` for single, and `'checkbox'` for multiple choices
     * @param range an `enum` or `string[]` with the possible values
     * @param selected [optional] the choices that are previously selected
     * @param isMandatory is it required to choose at least one value
     * @returns `get()`, `set(value: string)` and a `check()` that validates the current value
     */
    createChoiceWidget(id, validationFunction, type, range, selected, isMandatory = false) {
        const fieldSet = this._form.querySelector("fieldset[data-bind='" + id + "']");
        const fixRange = Array.isArray(range) ? range : Object.values(range);
        createChoiceWidget(fieldSet, id, selected, type, fixRange, isMandatory);
        function check() {
            const message = isMandatory ? 'One of the options has to be chosen' : validationFunction(get());
            fieldSet.setCustomValidity(message);
        }
        function get() {
            return JSON.parse(fieldSet.getAttribute("data-value") ?? "[]");
        }
        function set(values) {
            createChoiceWidget(fieldSet, id, values, type, fixRange, isMandatory);
        }
        fieldSet.addEventListener("change", () => check());
        return { get, set, check };
    }
    /**
     * creates a single checkbox that handles a simple boolean value
     * @param id of the HTMLSelectElement
     * @param selected is the checkbox checked initially
     * @returns `get()`, `set(value: string)` and a *disabled* `check()`
     */
    createSingleCheckbox(id, selected = false) {
        const input = this._form[id];
        input.checked = selected;
        function check() { }
        function get() {
            return input.checked;
        }
        function set(value) {
            input.checked = value;
        }
        return { get, set, check };
    }
    // controlling elements
    /**
     * creates a SelectionElement for an entity which will control other form elements
     * @param id of the HTMLSelectElement
     * @param entities that can be be chosen from
     * @param entityDisplayProp a property of an entity that will be displayed
     * @param formElements the form elements (combined with the corresponding slots of the entity as keys)
     * @returns the HTMLSelectElement itself
     */
    createEntitySelection(id, entities, entityDisplayProp, formElements, emptyOption = { value: '', text: ' --- ' }) {
        const selection = this.form[id];
        fillSelectWithEntities(selection, entities, entityDisplayProp, [], emptyOption);
        // when a pet is selected, populate the form with its data
        selection.addEventListener("change", () => {
            const entityId = selection.value;
            // fill the form with the pet's data
            if (entityId) {
                const entity = entities[entityId];
                for (const [elementId, element] of Object.entries(formElements)) {
                    element.set(entity[elementId]);
                }
            }
            else {
                this.form.reset();
            }
        });
        return selection;
    }
    /**
     * creates a ButtonElement which validates other form elements and provides their values to a
     * callback
     * @param id of the HTMLButtonElement
     * @param formElements the form elements (combined with the corresponding slots of the entity
     * as keys)
     * @param onConfirm a callback which provides the values of the form elements if the validation
     * was successful
     * @param entitySelection [optional] if there is an additional selection which controls the form
     * elements, then it can be passed here and the corresponding `entityDisplayProp` will be refreshed
     * @param entityDisplayProp [optional] the property of an entity that will be displayed in the
     * given `entitySelection`
     * @returns `get()`, `set(value: string)` and a `check()` that validates the current value
     */
    createSubmitButton(id, formElements, onConfirm, entitySelection, entityDisplayProp) {
        const submitButton = this.form[id];
        submitButton.addEventListener("click", () => {
            const slots = {};
            let nextProperty;
            // set error messages in case of constraint violations
            for (const [elementId, element] of Object.entries(formElements)) {
                element.check();
                if (elementId === "creatorId") {
                    slots[elementId] = auth.currentUser?.uid;
                }
                else {
                    slots[elementId] = element.get();
                }
                if (entityDisplayProp !== undefined && elementId === entityDisplayProp) {
                    nextProperty = element.get();
                }
            }
            // show possible errors
            this.form.reportValidity();
            // save the input date only if all of the form fields are valid
            if (this.form.checkValidity()) {
                onConfirm(slots);
                // update the selection list option element
                if (entitySelection !== undefined && nextProperty !== undefined) {
                    entitySelection.options[entitySelection.selectedIndex].text = nextProperty;
                }
            }
        });
        return submitButton;
    }
}
//# sourceMappingURL=FormFactory.js.map