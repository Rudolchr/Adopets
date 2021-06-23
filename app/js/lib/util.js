export function cloneObject(obj) {
    var p = "";
    var val;
    var clone = Object.create(Object.getPrototypeOf(obj));
    for (p in obj) {
        if (obj.hasOwnProperty(p)) {
            val = obj[p];
            if (val) {
                if (typeof val === "number" ||
                    typeof val === "string" ||
                    typeof val === "boolean" ||
                    val instanceof Date ||
                    (typeof val === "object" && !!val.constructor) ||
                    (Array.isArray(val) && !val.some((el) => typeof el === "object")) ||
                    (Array.isArray(val) &&
                        val.every((el) => typeof el === "object" && !!el.constructor))) {
                    if (Array.isArray(val))
                        clone[p] = val.slice(0);
                    else
                        clone[p] = val;
                }
            }
        }
    }
    return clone;
}
export function isDateOrDateString(date) {
    return (date !== undefined && (date instanceof Date || !isNaN(Date.parse(date))));
}
export function parseDate(date) {
    return date instanceof Date ? date : new Date(date);
}
export function getRawDate(date) {
    return date.toISOString().slice(0, 10);
}
export function compareDates(a, b) {
    if ((!a || !isDateOrDateString(a)) && (!b || !isDateOrDateString(b)))
        return 0;
    else if ((!a && b) || (!isDateOrDateString(a) && isDateOrDateString(b)))
        return -2;
    else if ((a && !b) || (isDateOrDateString(a) && !isDateOrDateString(b)))
        return 2;
    else {
        if (parseDate(a).getTime() === parseDate(b).getTime())
            return 0;
        else
            return parseDate(a).getTime() > parseDate(b).getTime() ? 1 : -1;
    }
}
export function isIntegerOrIntegerString(x) {
    return ((typeof x === "number" && Number.isInteger(x)) ||
        (typeof x === "string" && x.search(/^-?[0-9]+$/) === 0));
}
export function parseStringInteger(value) {
    return typeof value === "number" ? value : Number(value);
}
function createOption(val, txt, classValues) {
    var el = document.createElement("option");
    el.value = val;
    el.text = txt || val;
    if (classValues)
        el.className = classValues;
    return el;
}
export function fillSelectWithOptions(selectEl, selectionRange, optPar) {
    const options = Array.isArray(selectionRange)
        ? selectionRange
        : Object.keys(selectionRange);
    selectEl.innerHTML = "";
    if (!selectEl.multiple) {
        selectEl.add(createOption("", " --- ", undefined));
    }
    for (const i of options.keys()) {
        let optionEl = null;
        if (Array.isArray(selectionRange)) {
            optionEl = createOption((i + 1).toString(), options[i], undefined);
            if (selectEl.multiple &&
                optPar &&
                optPar.selection &&
                optPar.selection.includes(i + 1)) {
                optionEl.selected = true;
            }
        }
        else {
            const key = options[i];
            const obj = selectionRange[key];
            if (optPar && optPar.displayProp) {
                optionEl = createOption(key, obj[optPar.displayProp], undefined);
            }
            else {
                optionEl = createOption(key, obj[optPar], undefined);
            }
            if (selectEl.multiple &&
                optPar &&
                optPar.selection &&
                optPar.selection[key]) {
                optionEl.selected = true;
            }
        }
        selectEl.add(optionEl);
    }
}
function createLabeledChoiceControl(t, n, v, lbl) {
    var ccEl = document.createElement("input");
    var lblEl = document.createElement("label");
    ccEl.type = t;
    ccEl.name = n;
    ccEl.value = v;
    lblEl.appendChild(ccEl);
    lblEl.appendChild(document.createTextNode(lbl));
    return lblEl;
}
export function createChoiceWidget(containerEl, fld, values, choiceWidgetType, choiceItems, isMandatory) {
    const choiceControls = containerEl.querySelectorAll("label");
    for (const j of choiceControls.keys()) {
        containerEl.removeChild(choiceControls[j]);
    }
    if (!containerEl.hasAttribute("data-bind")) {
        containerEl.setAttribute("data-bind", fld);
    }
    if (choiceWidgetType === "radio" && isMandatory && values.length === 0) {
        values[0] = 1;
    }
    if (values.length >= 1) {
        if (choiceWidgetType === "radio") {
            containerEl.setAttribute("data-value", values[0].toString());
        }
        else {
            containerEl.setAttribute("data-value", "[" + values.join() + "]");
        }
    }
    for (const j of choiceItems.keys()) {
        const el = createLabeledChoiceControl(choiceWidgetType, fld, (j + 1).toString(), choiceItems[j]);
        const firstChild = el.firstElementChild;
        if (values.includes(j + 1))
            firstChild.checked = true;
        containerEl.appendChild(el);
        firstChild.addEventListener("click", (e) => {
            const btnEl = e.target;
            if (choiceWidgetType === "radio") {
                if (containerEl.getAttribute("data-value") !== btnEl.value) {
                    containerEl.setAttribute("data-value", btnEl.value);
                }
                else if (!isMandatory) {
                    btnEl.checked = false;
                    containerEl.setAttribute("data-value", "");
                }
            }
            else {
                let cbValues = JSON.parse(containerEl.getAttribute("data-value")) || [];
                let i = cbValues.indexOf(parseInt(btnEl.value));
                if (i > -1) {
                    cbValues.splice(i, 1);
                }
                else {
                    cbValues.push(btnEl.value);
                }
                containerEl.setAttribute("data-value", "[" + cbValues.join() + "]");
            }
        });
    }
    return containerEl;
}
export function isStringInRange(str, min, max = Number.MAX_VALUE) {
    return typeof str === "string" && str.length >= min && str.length < max;
}
function addItemToChoiceSet(listEl, stdId, humanReadableId, classValue) {
    let listItemEl = null;
    let el = null;
    listItemEl = document.createElement("li");
    listItemEl.setAttribute("data-value", stdId);
    el = document.createElement("span");
    el.textContent = humanReadableId;
    listItemEl.appendChild(el);
    el = createPushButton("✕");
    listItemEl.appendChild(el);
    if (classValue)
        listItemEl.classList.add(classValue);
    listEl.appendChild(listItemEl);
}
function createPushButton(txt) {
    const pB = document.createElement("button");
    pB.type = "button";
    if (txt)
        pB.textContent = txt;
    return pB;
}
function fillChoiceSet(listEl, selection, keyProp, displayProp) {
    let options = [];
    let obj = null;
    listEl.innerHTML = "";
    options = Object.keys(selection);
    for (const j of options.keys()) {
        obj = selection[options[j]];
        addItemToChoiceSet(listEl, obj[keyProp], obj[displayProp]);
    }
}
export function createMultipleChoiceWidget(widgetContainerEl, selection, selectionRange, keyProp, displayProp, minCard) {
    let assocListEl = document.createElement("ul");
    let selectEl = document.createElement("select");
    let el = null;
    widgetContainerEl.innerHTML = "";
    if (!displayProp)
        displayProp = keyProp;
    fillChoiceSet(assocListEl, selection, keyProp, displayProp);
    assocListEl.addEventListener("click", (e) => {
        let listItemEl = null;
        const btnEl = e.target;
        if (btnEl.tagName === "BUTTON") {
            listItemEl = btnEl.parentNode;
            if (listItemEl.classList.contains("removed")) {
                listItemEl.classList.remove("removed");
                btnEl.textContent = "✕";
            }
            else if (listItemEl.classList.contains("added")) {
                listItemEl.parentNode.removeChild(listItemEl);
                const optionEl = createOption(listItemEl.getAttribute("data-value"), listItemEl.firstElementChild.textContent);
                selectEl.add(optionEl);
            }
            else {
                listItemEl.classList.add("removed");
                btnEl.textContent = "undo";
            }
        }
    });
    widgetContainerEl.appendChild(assocListEl);
    el = document.createElement("div");
    el.appendChild(selectEl);
    el.appendChild(createPushButton("add"));
    selectEl.parentNode.addEventListener("click", (e) => {
        assocListEl = e.currentTarget.parentNode.firstElementChild;
        selectEl = e.currentTarget.firstElementChild;
        if (e.target.tagName === "BUTTON") {
            if (selectEl.value) {
                addItemToChoiceSet(assocListEl, selectEl.value, selectEl.options[selectEl.selectedIndex].textContent, "added");
                selectEl.remove(selectEl.selectedIndex);
                selectEl.selectedIndex = 0;
            }
        }
    });
    widgetContainerEl.appendChild(el);
    fillMultipleChoiceWidgetWithOptions(selectEl, selectionRange, keyProp, {
        displayProp,
        selection,
    });
}
function fillMultipleChoiceWidgetWithOptions(selectEl, selectionRange, keyProp, optPar) {
    var options = [], obj = null, displayProp = "";
    selectEl.innerHTML = "";
    selectEl.add(createOption("", " --- "));
    options = Object.keys(selectionRange);
    for (const i of options.keys()) {
        if (!optPar || !optPar.selection || !optPar.selection[options[i]]) {
            obj = selectionRange[options[i]];
            if (optPar && optPar.displayProp)
                displayProp = optPar.displayProp;
            else
                displayProp = keyProp;
            selectEl.add(createOption(obj[keyProp], obj[displayProp]));
        }
    }
}
export function createListFromMap(eTbl, displayProp, enumEl) {
    const listEl = document.createElement("ul");
    fillListFromMap(listEl, eTbl, displayProp, enumEl);
    return listEl;
}
function fillListFromMap(listEl, eTbl, displayProp, enumEl) {
    const keys = Object.keys(eTbl);
    listEl.innerHTML = "";
    for (const key of keys) {
        const listItemEl = document.createElement("li");
        if (enumEl) {
            listItemEl.textContent = enumEl.labels[eTbl[key] - 1];
        }
        else {
            listItemEl.textContent = eTbl[key][displayProp];
        }
        listEl.appendChild(listItemEl);
    }
}
export function isNonEmptyString(x) {
    return typeof x === "string" && x.trim() !== "";
}
//# sourceMappingURL=util.js.map