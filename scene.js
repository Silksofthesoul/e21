import { element, insert } from './library/dom';
import { int } from './library/type';
import { Base } from './base.js';
import { WFC } from './wfc.js';
export class Scene extends Base {
  elScene = null;
  WFC = null;

  timer = null;
  msLoop = 10;

  wfcWidth = 0;
  wfcHeight = 0;

  constructor(params = {}) {
    super(params);
    this.createScene();
    this.WFC = new WFC({ width: this.wfcWidth, height: this.wfcHeight });
    this.render();
    this.loop();
  }

  createScene() {
    this.elScene = element('pre', { class: 'scene' });
    insert(this.elScene);
    const { padding, fontSize, width, height } = getComputedStyle(this.elScene);
    const magicFZ = 30;
    this.log({ padding, fontSize, width, height });
    const nWidth = int(width);
    const nHeight = int(height) - (int(fontSize) / 2);
    this.wfcWidth = int(nWidth / int(24));
    this.wfcHeight = int(nHeight / int(magicFZ));
  }

  loop() {
    const process = _ => {
      this.render();
      this.timer = setTimeout(process, this.msLoop);
    };
    process();
  }

  render() {
    this.WFC.collapseStep();
    this.elScene.innerText = this.WFC.str;
  }

}
