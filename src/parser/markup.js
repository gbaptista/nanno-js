import ParserHelper from './helper';
import ColorParser from './color';

class MarkupParser {
  static parse(source) {
    const ast = {};

    MarkupParser.parseSource(source).forEach((sectionSource) => {
      const result = MarkupParser.parseSection(sectionSource);
      result.objects.forEach((object) => {
        if (ast[object] === undefined) {
          ast[object] = {};
        }

        Object.keys(result.properties).forEach((key) => {
          const value = result.properties[key];

          if (key === 'text-content') {
            if (/^"/.exec(value)) {
              ast[object][key] = value.replace(/^"/, '').replace(/"$/m, '');
            } else {
              ast[object][key] = value;
            }
          } else if (key === 'position') {
            const [column, row] = value.split('/');

            ast[object].column = parseFloat(column);
            ast[object].row = parseFloat(row);
          } else if (/color/.exec(key)) {
            ast[object][key] = ColorParser.parse(value);
          } else if (value === 'false') {
            ast[object][key] = false;
          } else if (value === 'true') {
            ast[object][key] = true;
          } else if (value === 'no') {
            ast[object][key] = false;
          } else if (value === 'yes') {
            ast[object][key] = true;
          } else if (/width|height|repeat|column|row/.exec(key)) {
            ast[object][key] = parseInt(value, 10);
          } else {
            ast[object][key] = value;
          }
        });
      });
    });

    return ast;
  }

  static parseSection(source) {
    const objects = [];
    const properties = {};

    let cleanSource = source;

    let flowContent = true;

    const flows = {};

    while (flowContent) {
      flowContent = /\[(.|\n)*?\]/m.exec(cleanSource);

      if (flowContent) {
        const flowKey = `{FLOW-${Object.keys(flows).length}}`;

        [flows[flowKey]] = flowContent;

        cleanSource = cleanSource.replace(flowContent[0], flowKey);
      }
    }

    cleanSource.split('\n').forEach((line) => {
      if (/^\s/.exec(line)) {
        let lineToParse = line.trim();

        let textContent = true;

        while (textContent) {
          textContent = /\S+\s+".*?"/.exec(lineToParse);

          if (textContent) {
            lineToParse = lineToParse.replace(textContent[0], '');
            const key = /\S+\s+/.exec(textContent[0]);

            const value = textContent[0].replace(key[0], '');

            properties[key[0].trim()] = value.trim();
          }
        }

        if (lineToParse.trim() !== '') {
          const parts = lineToParse.trim().split(/\s+/);

          while (parts.length > 0) {
            const key = parts.shift();
            const value = parts.shift();

            if (value.startsWith('{FLOW-')) {
              properties[key] = flows[value];
            } else {
              properties[key] = value;
            }
          }
        }
      } else {
        objects.push(...line.split(/\s+/).filter((object) => object.trim() !== ''));
      }
    });

    return { objects, properties };
  }

  static parseSource(source) {
    const sections = [];

    let buffer = '';

    let waiting = false;

    source.split('\n').forEach((line) => {
      if (/^\s/.exec(line)) {
        waiting = true;
      }

      if (/^\S/.exec(line) && waiting) {
        if (buffer.trim() !== '') sections.push(ParserHelper.removeVoids(buffer));
        buffer = line;
        waiting = false;
      } else {
        buffer += `\n${line}`;
      }
    });

    if (buffer.trim() !== '') sections.push(ParserHelper.removeVoids(buffer));

    return sections;
  }
}

export default MarkupParser;
