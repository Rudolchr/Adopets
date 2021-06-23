"use strict";
Array.max = (array) => Math.max.apply(Math, array);
Array.min = (array) => Math.min.apply(Math, array);
Array.prototype.clone = () => this.slice(0);
Array.prototype.isEqualTo = (a2) => this.length === a2.length && this.every((el, i) => el === a2[i]);
//# sourceMappingURL=browserShimps.js.map