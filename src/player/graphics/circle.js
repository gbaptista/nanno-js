class Circle {
  static draw(element, pixi) {
    const container = new pixi.Container();

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

    const object = {};

    object.container = container;
    object.graphic = circle;

    return object;
  }
}

export default Circle;
