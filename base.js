import { rndMinMaxInt } from './library/math.js';

export class Base {
  constructor(params = {}) { }
  log(...args) {
    console.log(...args);
    return this.log;
  }
}

export const rndFromArray = arr => arr[rndMinMaxInt(0, arr.length - 1)];
