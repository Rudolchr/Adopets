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
/**
 * runs the given `validationFunction` and returns the given `errorMessage` if the function throws an Error - which will be also logged to `console.error`.
 * Returns an empty string otherwise.
 * @param values that will be iterated and checked with the function
 * @param validationFunction to run
 * @param errorMessage to show if the `validationFunction` throws an Error
 * @returns the given `errorMessage` if the `validationFunction` throws an Error. Returns `""` otherwise
 */
export function catchValidations(values, validationFunction, errorMessage) {
    try {
        for (const value of values) {
            validationFunction(value);
        }
        return "";
    }
    catch (error) {
        console.error(error);
        return errorMessage;
    }
}
export function GetURLParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (const sParamName of sURLVariables) {
        var sParameterName = sParamName.split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
}
//# sourceMappingURL=newUtil.js.map