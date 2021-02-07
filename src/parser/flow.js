import MarkupParser from './markup';

class FlowParser {
  static parse(source, previousScene) {
    const ast = { timeline: [] };

    let currentScene = previousScene;

    if (currentScene === undefined) currentScene = 0;

    let cleanSource = source.replace(/.*?\[/, '');
    cleanSource = cleanSource.replace(/\].*/, '');

    let flows = cleanSource.split('>');

    flows = flows.map((flow) => flow.split('\n').join(' ').replace(/\s+/g, ' ').trim()).filter(
      (flow) => flow.trim() !== '',
    );

    flows.forEach((flowSource) => {
      const parts = flowSource.split(/\s+/);

      const specialValues = [];

      if (/^\d/.exec(parts[0])) {
        specialValues.push(parts.shift());
      }

      if (specialValues.length > 0 && /^\d/.exec(parts[0])) {
        specialValues.push(parts.shift());
      }

      const flowPlaceboSource = `f\n  ${parts.join(' ')}`;
      const result = MarkupParser.parseSection(flowPlaceboSource);

      specialValues.forEach((specialValue) => {
        if (/\//.exec(specialValue)) {
          const [column, row] = specialValue.split('/');

          if (result.properties.column === undefined) {
            result.properties.column = parseFloat(column);
          }

          if (result.properties.row === undefined) {
            result.properties.row = parseFloat(row);
          }
        } else if (result.properties.scene === undefined) {
          result.properties.scene = parseInt(specialValue, 10);
        }
      });

      if (result.properties.scene === undefined) {
        currentScene += 1;
        result.properties.scene = currentScene;
      } else {
        currentScene = result.properties.scene;
      }

      ast.timeline.push(result.properties);
    });

    ast.previousScene = currentScene;

    return ast;
  }
}

export default FlowParser;
