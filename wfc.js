import { int } from './library/type.js';
import { len, s } from './library/array.js';
import { rndFromArray, rndMinMaxInt } from './library/math.js';
import { Base } from './base.js';
import { Cell } from './cell.js';
const sp = str => str.split('');
const createNeighbour = (tile, id, validNeighbours) => ({ tile, id, validNeighbours });
export class WFC extends Base {
  // ╬
  // ═
  // ║
  // ╝
  // ╚
  // ╗
  // ╔
  options = [
    /* 0 */  createNeighbour(' ', 'E', { top: [0, 1, 6, 7, 8], right: [0, 2, 5, 8, 10], bottom: [0, 3, 6, 9, 10], left: [0, 4, 5, 7, 9] }),
    /* 1 */  createNeighbour('╩', 'T', { top: [0, 2, 3, 4, 5, 9, 10], right: [1, 3, 4, 6, 7, 9], bottom: [0], left: [1, 2, 3, 6, 8, 10] }),
    /* 2 */  createNeighbour('╠', 'R', { top: [2, 3, 4, 5, 9, 10], right: [1, 3, 4, 6, 7, 9], bottom: [1, 2, 4], left: [0] }),
    /* 3 */  createNeighbour('╦', 'B', { top: [0], right: [1, 3, 4, 6, 7, 9], bottom: [1, 2, 4, 5, 7, 8], left: [1, 2, 3, 6, 8, 10] }),
    /* 4 */  createNeighbour('╣', 'L', { top: [2, 3, 4, 5, 9, 10], right: [0], bottom: [1, 2, 4, 5, 7, 8], left: [1, 2, 3, 6, 8, 10] }),
    /* 5 */  createNeighbour('║', 'V', { top: [2, 3, 4, 5, 9, 10], right: [0], bottom: [1, 2, 4, 5, 7, 8], left: [0] }),
    /* 6 */  createNeighbour('═', 'H', { top: [0], right: [1, 3, 4, 5], bottom: [0], left: [1, 2, 3, 6, 8, 10] }),
    /* 7 */  createNeighbour('╝', 'ALT', { top: [2, 3, 4, 5, 9, 10], right: [0], bottom: [0], left: [1, 2, 3, 6, 8, 10] }),
    /* 8 */  createNeighbour('╚', 'ART', { top: [2, 3, 4, 5, 9, 10], right: [1, 3, 4, 6, 7, 9], bottom: [0], left: [0] }),
    /* 9 */  createNeighbour('╗', 'ALB', { top: [0], right: [0], bottom: [1, 2, 4, 5, 7, 8], left: [1, 2, 3, 4, 6, 7, 9] }),
    /* 10 */ createNeighbour('╔', 'ARB', { top: [0], right: [1, 3, 4, 6, 7, 9], bottom: [1, 2, 4, 5, 7, 8], left: [0] }),
  ];

  width = 80;
  height = 30;

  convas = [];
  collapsed = [];
  notCollapsed = [];

  currentPoint = { x: -1, y: -1 };
  previousPoint = { x: -1, y: -1 };
  vc = 0;

  constructor(params = {}) {
    super(params);
    const { width, height } = params;
    this.width = width || this.width;
    this.height = height || this.height;
    this.init();
  }

  init() {
    for (let y = 0; y < this.height; y++) {
      this.convas.push([]);
      for (let x = 0; x < this.width; x++) {
        this.notCollapsed.push(this.hash(x, y));
        this.convas[y].push(new Cell({ options: this.options }));
      }
    }
    this.setRndPoint();
  }

  setRndPointX() {
    const { minWidth, maxWidth } = this;
    this.currentPoint.x = rndMinMaxInt(minWidth, maxWidth);
  }

  setRndPointY() {
    const { minHeight, maxHeight } = this;
    this.currentPoint.y = rndMinMaxInt(minHeight, maxHeight);
  }

  setRndPoint() {
    this.setRndPointX();
    this.setRndPointY();
  }

  setNextStep() {
    if (len(this.notCollapsed) === 0) return null;
    let notCollapsedPoint = rndFromArray(this.notCollapsed);
    const [nx, ny] = this.unhash(notCollapsedPoint);
    this.currentPoint.x = nx;
    this.currentPoint.y = ny;
  }

  setCollapsedPoint(x, y) {
    const hash = this.hash(x, y);
    const index = this.notCollapsed.findIndex(h => h === hash);
    if (index !== -1) this.notCollapsed.splice(index, 1);
    this.collapsed.push(hash);
  }

  collapse() { }

  collapseStep() {
    if (!this.isCollapsed) this.collapseCell();
    else this.validateCell();
  }

  hash(x, y) { return `${x}:${y}` }
  unhash(val) { return val.split(':').map(val => int(val)) }

  collapseCell() {
    const { x, y } = this.currentPoint;
    const { around } = this;
    const init = this.isInit;
    this.convas[y][x].collapse({ convas: this.convas, x, y, init, context: this, around });
    this.setCollapsedPoint(x, y);
    this.setNextStep();

  }

  validateCell() {
    const validatePoint = this.collapsed[this.vc];
    const [x, y] = this.unhash(validatePoint);
    const around = this.#around(x, y);
    this.convas[y][x].validate({ convas: this.convas, x, y, context: this, around });
    this.vc++;
    if (this.vc > len(this.collapsed) - 1) this.vc = 0;

  }

  get isInit() { return len(this.collapsed) === 0; }
  get isCollapsed() { return len(this.notCollapsed) === 0; }

  #around(x, y) {
    const empty = -1;
    const { minWidth, maxWidth, minHeight, maxHeight, convas } = this;
    let [lx, rx, ty, by] = [x - 1, x + 1, y - 1, x + 1];
    if (lx < minWidth) lx = empty;
    if (rx > maxWidth) rx = empty;
    if (ty < minHeight) ty = empty;
    if (by > maxHeight) by = empty;
    const top = ty != empty ? convas[ty][x].value : [empty];
    const bottom = by != empty ? convas[by][x].value : [empty];
    const left = lx != empty ? convas[y][lx].value : [empty];
    const right = rx != empty ? convas[y][rx].value : [empty];
    return { top, right, bottom, left };
  }

  get around() {
    const { x, y } = this.currentPoint;
    return this.#around(x, y);
  }

  get minHeight() { return 0; }
  get minWidth() { return 0; }
  get maxWidth() { return len(this.convas[0]) - 1; }
  get maxHeight() { return len(this.convas) - 1; }
  get str() {
    const getRow = (sum, cell) => {
      const cond = cell.display !== -1;
      sum += cond ? this.options[cell.display].tile : '╬';
      return sum;
    };
    return this.convas
      .map(row => row.reduce(getRow, ''))
      .join('\n');
  }
}
