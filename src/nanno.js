import Injector from './injector';
import SourceParser from './parser/05-source';
import Controller from './player/controller';

const VERSION = '0.0.1';

class Nanno {
  static version() {
    return VERSION;
  }

  constructor(dependencies) {
    this.dependencies = new Injector(dependencies);
    this.VERSION = VERSION;
  }

  version() {
    return this.VERSION;
  }

  render(content, target, onRender) {
    const ast = SourceParser.parse(content);

    const controller = new Controller(target, ast, this.dependencies, onRender);

    controller.setup();
    controller.render();
  }

  renderFile(sourcePath, target, onRender) {
    fetch(sourcePath, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
      .then((response) => response.text())
      .then((content) => {
        this.render(content, target, onRender);
      })
      .catch((error) => { throw error; });
  }
}

Nanno.VERSION = VERSION;

export default Nanno;
