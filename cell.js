import { rndMinMaxInt } from './library/math.js';
import { len, getIntersectedElements } from './library/array.js';
import { int, str, isArray } from './library/type.js';
import { sp } from './library/stringTmpl.js';
import { Base, rndFromArray } from './base.js';
import { when } from 'ramda';

export class Cell extends Base {
  options = {};
  value = [];
  #variants = [];
  constructor(params = {}) {
    super(params);
    const { options } = params;
    this.options = options;
    options.forEach((_, index) => {
      this.value.push(index);
      this.#variants.push(index);
    });

  }

  collapseInit() {
    this.value = [len(this.value) > 0 ? rndFromArray(this.value) : rndFromArray(this.#variants)];
  }

  collapseCell(around = {}) {
    if (this.isCollapsed) return null;
    const { top, left, bottom, right } = around;
    const { options } = this;
    const [ct, cb, cl, cr] = [
      len(top) === 1,
      len(bottom) === 1,
      len(left) === 1,
      len(right) === 1,
    ];
    if ([ct, cb, cl, cr].every(c => !c)) return this.collapseInit();
    if (ct) {
      let [n] = top;
      if (n === -1) n = rndFromArray(this.#variants);
      const { bottom: valid = [] } = this.options[n].validNeighbours;
      const t = getIntersectedElements(this.value, valid.map(val => int(val)));
      this.value = t;
      if (len(this.value) === 0) this.collapseInit();
      if (this.isCollapsed) return null;
    }
    else if (cb) {
      let [n] = bottom;
      if (n === -1) n = rndFromArray(this.#variants);
      const { top: valid = [] } = this.options[n].validNeighbours;
      const t = getIntersectedElements(this.value, valid.map(val => int(val)));
      this.value = t;
      if (len(this.value) === 0) this.collapseInit();
      if (this.isCollapsed) return null;
    }
    else if (cl) {
      let [n] = left;
      if (n === -1) n = rndFromArray(this.#variants);
      const { right: valid = [] } = this.options[n].validNeighbours;
      const t = getIntersectedElements(this.value, valid.map(val => int(val)));
      this.value = t;
      if (len(this.value) === 0) this.collapseInit();
      if (this.isCollapsed) return null;
    }
    else if (cr) {
      let [n] = right;
      if (n === -1) n = rndFromArray(this.#variants);
      const { left: valid = [] } = this.options[n].validNeighbours;
      const t = getIntersectedElements(this.value, valid.map(val => int(val)));
      this.value = t;
      if (len(this.value) === 0) this.collapseInit();
      if (this.isCollapsed) return null;
    }
    this.collapseInit();
  }
  validateCell(around = {}) {
    const { top: at, left: al, bottom: ab, right: ar } = around;
    const { options, value } = this;
    const { validNeighbours } = options[value];
    const { top: ot, left: ol, bottom: ob, right: or } = validNeighbours;

    if (!ot.includes(ab)) this.value = [rndFromArray(this.#variants)];
    else if (!ob.includes(at)) this.value = [rndFromArray(this.#variants)];
    else if (!ol.includes(ar)) this.value = [rndFromArray(this.#variants)];
    else if (!or.includes(al)) this.value = [rndFromArray(this.#variants)];
  }

  collapse(params = {}) {
    const { init, around } = params;
    if (init) this.collapseInit();
    else this.collapseCell(around);
  }
  validate(params = {}) {
    const { around } = params;
    this.validateCell(around);
  }


  get isCollapsed() { return len(this.value) === 1; }
  get isAssumption() { return len(this.value) !== 1 && len(this.value) < len(this.options); }
  get display() { return len(this.value) === 1 ? this.value[0] : -1; }
}
