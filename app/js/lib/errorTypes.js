export class ConstraintViolation {
    constructor(msg) {
        this.message = msg;
    }
}
export class NoConstraintViolation extends ConstraintViolation {
    constructor(msg, v) {
        super(msg);
        if (v)
            this.checkedValue = v;
        this.message = "";
    }
}
export class MandatoryValueConstraintViolation extends ConstraintViolation {
    constructor(msg) {
        super(msg);
    }
}
export class RangeConstraintViolation extends ConstraintViolation {
    constructor(msg) {
        super(msg);
    }
}
export class StringLengthConstraintViolation extends ConstraintViolation {
    constructor(msg) {
        super(msg);
    }
}
export class IntervalConstraintViolation extends ConstraintViolation {
    constructor(msg) {
        super(msg);
    }
}
export class PatternConstraintViolation extends ConstraintViolation {
    constructor(msg) {
        super(msg);
    }
}
export class UniquenessConstraintViolation extends ConstraintViolation {
    constructor(msg) {
        super(msg);
    }
}
export class ReferentialIntegrityConstraintViolation extends ConstraintViolation {
    constructor(msg) {
        super(msg);
    }
}
export class FrozenValueConstraintViolation extends ConstraintViolation {
    constructor(msg) {
        super(msg);
    }
}
//# sourceMappingURL=errorTypes.js.map