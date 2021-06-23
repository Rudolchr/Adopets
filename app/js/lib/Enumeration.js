import { ConstraintViolation } from "./errorTypes.js";
export function Enumeration(enumArg) {
    if (Array.isArray(enumArg)) {
        if (!enumArg.every((l) => typeof l === "string")) {
            throw new ConstraintViolation("A list of enumeration labels must be an array of strings!");
        }
        this.labels = enumArg;
        this.enumLitNames = this.labels;
        this.codeList = null;
    }
    else if (typeof enumArg === "object" && Object.keys(enumArg).length > 0) {
        if (!Object.keys(enumArg).every((code) => typeof enumArg[code] === "string")) {
            throw new ConstraintViolation("All values of a code list map must be strings!");
        }
        this.codeList = enumArg;
        this.enumLitNames = Object.keys(this.codeList);
        this.labels = this.enumLitNames.map((c) => `${enumArg[c]} (${c})`);
    }
    else {
        throw new ConstraintViolation(`Invalid Enumeration constructor argument: ${enumArg}`);
    }
    this.MAX = this.enumLitNames.length;
    for (let i = 1; i <= this.enumLitNames.length; i++) {
        const lbl = this.enumLitNames[i - 1].replace(/( |-)/g, "_");
        const LBL = lbl
            .split("_")
            .map((lblPart) => lblPart.toUpperCase())
            .join("_");
        this[LBL] = i;
    }
    Object.freeze(this);
}
Enumeration.prototype.stringify = function (a) {
    return a.map((enumInt) => this.enumLitNames[enumInt - 1]).join(", ");
};
//# sourceMappingURL=Enumeration.js.map