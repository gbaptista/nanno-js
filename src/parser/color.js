import COLORS from './color_names';

class ColorParser {
  static parse(source) {
    const sourceToParse = source.toString().replace('0x', '#');

    if (sourceToParse.startsWith('#')) {
      return ColorParser.parseRGB(sourceToParse);
    }

    const colorName = sourceToParse.replace(/\W/, '').trim().toLowerCase();

    if (COLORS[colorName] !== undefined) {
      return ColorParser.parseRGB(COLORS[colorName]);
    }

    return parseInt(sourceToParse, 10);
  }

  static parseRGB(source) {
    let rgbSource = source;

    while (rgbSource.length < 7) {
      rgbSource += rgbSource.slice(-1);
    }

    return parseInt(rgbSource.replace('#', '0x'), 16);
  }
}

export default ColorParser;
