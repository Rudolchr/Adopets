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
//# sourceMappingURL=newUtil.js.map