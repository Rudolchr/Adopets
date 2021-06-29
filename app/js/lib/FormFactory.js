import { fillSelectWithEntities, fillSelectWithRange } from "./newUtil.js";
export class FormFactory {
    _form;
    constructor(name, neutralize = true) {
        this._form = document.forms.namedItem(name);
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
            else {
                input.valueAsDate = value;
            }
        }
        input.addEventListener("input", () => check());
        return { get, set, check };
    }
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
    createEntitySelection(id, entities, entityDisplayProp, formElements) {
        const selection = this.form[id];
        fillSelectWithEntities(selection, entities, entityDisplayProp);
        // when a pet is selected, populate the form with its data
        selection.addEventListener("change", () => {
            const entityId = selection.value;
            // fill the form with the pet's data
            if (entityId) {
                const entity = entities[entityId];
                Object.entries(formElements).forEach(entry => {
                    entry[1].set(entity[entry[0]]);
                });
            }
            else {
                this.form.reset();
            }
        });
        return selection;
    }
    createSubmitButton(submitButtonId, formElements, onConfirm, entityDisplayProp, entitySelection) {
        const saveButton = this.form[submitButtonId];
        saveButton.addEventListener("click", () => {
            const slots = {};
            let nextProperty;
            // set error messages in case of constraint violations
            Object.entries(formElements).forEach(entry => {
                entry[1].check();
                slots[entry[0]] = entry[1].get();
                if (entityDisplayProp !== undefined && entry[0] === entityDisplayProp) {
                    nextProperty = entry[1].get();
                }
            });
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
    }
}
//# sourceMappingURL=FormFactory.js.map