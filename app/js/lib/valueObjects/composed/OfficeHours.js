import { OptionalString } from "../OptionalString.js";
export class OfficeHours {
    _times;
    constructor(times) {
        this._times = times;
    }
    get times() {
        return this._times;
    }
    set times(times) {
        this._times = times;
    }
    static checkTimes(times) {
        try {
            this.checkDay(times.monday);
            this.checkDay(times.tuesday);
            this.checkDay(times.wednesday);
            this.checkDay(times.thursday);
            this.checkDay(times.friday);
            this.checkDay(times.saturday);
            this.checkDay(times.sunday);
            return "";
        }
        catch (error) {
            throw new RangeError("You need to give alle opening times correct!");
        }
    }
    static checkDay(dayTime) {
        if (dayTime[0] === "") {
            if (dayTime[1] !== "") {
                throw new RangeError("You need to give a opening time when giving a closing time!");
            }
        }
        else {
            if (dayTime[1] === "") {
                throw new RangeError("You need to give a closing time when giving a opening time!");
            }
        }
        return dayTime;
    }
    static checkTime(time) {
        try {
            OptionalString.validate(time);
            return "";
        }
        catch (error) {
            console.error(error);
            return "The given time is not a string!";
        }
    }
    equals(times) {
        if (this.times.monday[0] !== times.monday[0] && this.times.monday[1] !== times.monday[1]) {
            return false;
        }
        if (this.times.tuesday[0] !== times.tuesday[0] && this.times.tuesday[1] !== times.tuesday[1]) {
            return false;
        }
        if (this.times.wednesday[0] !== times.wednesday[0] && this.times.wednesday[1] !== times.wednesday[1]) {
            return false;
        }
        if (this.times.thursday[0] !== times.thursday[0] && this.times.thursday[1] !== times.thursday[1]) {
            return false;
        }
        if (this.times.friday[0] !== times.friday[0] && this.times.friday[1] !== times.friday[1]) {
            return false;
        }
        if (this.times.saturday[0] !== times.saturday[0] && this.times.saturday[1] !== times.saturday[1]) {
            return false;
        }
        if (this.times.sunday[0] !== times.sunday[0] && this.times.sunday[1] !== times.sunday[1]) {
            return false;
        }
        return true;
    }
    /** @returns a list of string (stringified times for days) */
    toList() {
        const result = [];
        if (this.times.monday[0] !== "" && this.times.monday[1] !== "") {
            result.push(`Monday: ${this.times.monday[0]}-${this.times.monday[1]}`);
        }
        if (this.times.tuesday[0] !== "" && this.times.tuesday[1] !== "") {
            result.push(`Tuesday: ${this.times.tuesday[0]}-${this.times.tuesday[1]}`);
        }
        if (this.times.wednesday[0] !== "" && this.times.wednesday[1] !== "") {
            result.push(`Wednesday: ${this.times.wednesday[0]}-${this.times.wednesday[1]}`);
        }
        if (this.times.thursday[0] !== "" && this.times.thursday[1] !== "") {
            result.push(`Thursday: ${this.times.thursday[0]}-${this.times.thursday[1]}`);
        }
        if (this.times.friday[0] !== "" && this.times.friday[1] !== "") {
            result.push(`Friday: ${this.times.friday[0]}-${this.times.friday[1]}`);
        }
        if (this.times.saturday[0] !== "" && this.times.saturday[1] !== "") {
            result.push(`Saturday: ${this.times.saturday[0]}-${this.times.saturday[1]}`);
        }
        if (this.times.sunday[0] !== "" && this.times.sunday[1] !== "") {
            result.push(`Sunday: ${this.times.sunday[0]}-${this.times.sunday[1]}`);
        }
        return result;
    }
}
//# sourceMappingURL=OfficeHours.js.map