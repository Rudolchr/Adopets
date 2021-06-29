import {Entity, EntitySlots} from "./Entity.js";
import {fillSelectWithEntities, fillSelectWithRange} from "./newUtil.js";

interface FormElementBase {
    get: () => string;
    check: () => void;
    set: (value: any) => void;
}

interface IOFormElement extends FormElementBase {
    set: (value: string | Date) => void;
}

interface SelectionFormElement extends FormElementBase {
    set: (value: string) => void;
}

export class FormFactory {
    private _form: HTMLFormElement;

    constructor(name: string, neutralize: boolean = true) {
        this._form = document.forms.namedItem(name)!;
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

    createOutput(id: string): IOFormElement {
        const output: HTMLOutputElement = this._form[id];
        function get() {
            return output.value;
        }
        function set(value: string | Date) {
            output.value = typeof value === 'string' ? value : value.toString();
        }
        function check() {/** does nothing though its an output */}
        return {get, set, check};
    }

    createInput(id: string, validationFunction: (value: string) => string): IOFormElement {
        const input: HTMLInputElement = this._form[id];
        function check() {
            input.setCustomValidity(validationFunction(input.value));
        }
        function get() {
            return input.value;
        }
        function set(value: string | Date) {
            if (typeof value === 'string') {
                input.value = value;
            } else {
                input.valueAsDate = value;
            }
        }
        input.addEventListener("input", () => check());

        return {get, set, check};
    }

    createReferenceSelection<E extends Entity<any>>(
        id: string,
        validationFunction: (value: string) => string,
        entities: {[key: string]: E;},
        referenceDisplayProp: keyof E,
        selected?: string[]
    ): SelectionFormElement {
        const selection: HTMLSelectElement = this._form[id];
        fillSelectWithEntities(selection, entities, referenceDisplayProp, selected);
        function check() {
            selection.setCustomValidity(validationFunction(selection.value));
        }
        function get() {
            return selection.value;
        }
        function set(value: string) {
            fillSelectWithEntities(selection, entities, referenceDisplayProp, [value]);
        }
        selection.addEventListener("change", () => check());

        return {get, set, check};
    }

    createRangeSelection(id: string, validationFunction: (value: string) => string, range: {[key: string]: string;} | string[], selected?: string[]): SelectionFormElement {
        const selection: HTMLSelectElement = this._form[id];
        fillSelectWithRange(selection, range, selected);
        function check() {
            selection.setCustomValidity(validationFunction(selection.value));
        }
        function get() {
            return selection.value;
        }
        function set(value: string) {
            fillSelectWithRange(selection, range, [value]);
        }
        selection.addEventListener("change", () => check());

        return {get, set, check};
    }

    createEntitySelection<S extends EntitySlots, E extends Entity<S>>(
        id: string,
        entities: {[key: string]: E;},
        entityDisplayProp: keyof E,
        formElements: Record<keyof S, FormElementBase>,
    ) {
        const selection: HTMLSelectElement = this.form[id];
        fillSelectWithEntities(selection, entities, entityDisplayProp);

        // when a pet is selected, populate the form with its data
        selection.addEventListener("change", () => {
            const entityId = selection.value;

            // fill the form with the pet's data
            if (entityId) {
                const entity = entities[entityId];
                Object.entries(formElements).forEach(entry => {
                    entry[1].set(entity[entry[0] as keyof E]);
                });
            } else {
                this.form.reset();
            }
        });

        return selection;
    }

    createSubmitButton<S extends EntitySlots, E extends Entity<S>>(
        submitButtonId: string,
        formElements: Record<keyof S, FormElementBase>,
        onConfirm: (slots: S) => void,
        entityDisplayProp?: keyof E,
        entitySelection?: HTMLSelectElement
    ) {
        const saveButton: HTMLButtonElement = this.form[submitButtonId];
        saveButton.addEventListener("click", () => {
            const slots: any = {};
            let nextProperty: string | undefined;
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