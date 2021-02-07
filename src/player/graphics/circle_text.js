import TextHelper from './helpers/text';

class CircleText {
  static draw(element, pixi) {
    const container = new pixi.Container();

    const text = TextHelper.build(element, pixi);

    const radius = 32;

    let backgroundColor = 0xf54257;

    if (element.markup['background-color'] !== undefined) {
      backgroundColor = element.markup['background-color'];
    }

    const circle = new pixi.Graphics();
    circle.beginFill(backgroundColor);
    circle.drawCircle(0, 0, radius);
    circle.endFill();

    container.addChild(circle);
    container.addChild(text);

    const object = {};

    object.container = container;
    object.graphic = circle;
    object.text = text;

    return object;
  }
}

export default CircleText;
