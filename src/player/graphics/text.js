import TextHelper from './helpers/text';

class Text {
  static draw(element, pixi) {
    const container = new pixi.Container();

    const text = TextHelper.build(element, pixi);

    container.addChild(text);

    const object = {};

    object.container = container;
    object.text = text;

    return object;
  }
}

export default Text;
