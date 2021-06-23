export class ValueObject {
    _value;
    constructor(value) {
        this._value = value;
    }
    static pm(n) {
        return n ? n + '->' : '';
    }
    get value() {
        return this._value;
    }
    toJSON() {
        return this._value;
    }
}
//# sourceMappingURL=ValueObject.js.map