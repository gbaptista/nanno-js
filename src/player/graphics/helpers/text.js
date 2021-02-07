class TextHelper {
  static build(element, pixi) {
    let color = 0xFFFFFF;

    let font;

    if (element.markup['text-font'] !== undefined) {
      font = element.markup['text-font'];
    }

    if (element.markup.color !== undefined) {
      color = element.markup.color;
    }

    const styleProperties = {
      fontSize: 38,
      fill: 0xFFFFFF,
      align: 'center',
    };

    if (font !== undefined) {
      styleProperties.fontFamily = font;
    }

    const style = new pixi.TextStyle(styleProperties);

    const text = new pixi.Text(element.markup['text-content'], style);

    text.x = -(text.width / 2);
    text.y = -(text.height / 2);
    text.tint = color;

    return text;
  }
}

export default TextHelper;
