import Motion from './motion';

class ElementParser {
  static parse(source) {
    let id = source;
    let textContent;
    let motion;

    if (source.includes(':')) {
      const parts = source.split(':');
      [id, textContent] = parts;
    } else if (source.includes('/')) {
      const parts = source.split('/');
      [id, textContent] = parts;
    } else if (source.includes('|')) {
      const parts = source.split('|');
      [id, textContent] = parts;
    }

    if (Motion.SYMBOLS[id[0]] !== undefined) {
      motion = Motion.SYMBOLS[id[0]];
      id = id.substring(1);
    }

    if (textContent && (textContent.startsWith('"') || textContent.startsWith("'"))) {
      textContent = textContent.substring(1, textContent.length - 1);
    }

    const markup = {};

    if (textContent !== undefined) markup['text-content'] = textContent;
    if (motion !== undefined) markup.motion = motion;

    const ast = { id, markup };

    return ast;
  }
}

export default ElementParser;
