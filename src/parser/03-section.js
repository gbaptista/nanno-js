import MarkupParser from './markup';
import StageParser from './02-stage';
import ElementParser from './element';

class SectionParser {
  static parse(section, previousScene, columnMap) {
    const ast = {
      scenes: [],
      stage: undefined,
      columnMap,
      firstScene: previousScene,
      lastScene: previousScene,
      leakedBaseMarkup: {},
    };

    let currentScene = previousScene;

    if (currentScene === undefined) {
      currentScene = 1;
    } else {
      currentScene += 1;
    }

    if (section.stage !== undefined) {
      const stage = StageParser.parse(section.stage, columnMap);

      const elements = stage.elements.map(((elementSource) => {
        const element = ElementParser.parse(elementSource.token);

        element.row = elementSource.row;
        element.column = elementSource.column;

        return element;
      }));

      ast.stage = { elements };
      ast.columnMap = stage.columnMap;
      ast.lastRow = stage.lastRow;
    } else {
      ast.columnMap = columnMap;
    }

    if (section.markup) {
      let scenesSource = section.markup.split(/^(scene|>)/m);

      scenesSource = scenesSource.map((content) => content.trim()).filter(
        (content) => content !== '' && content !== 'scene' && content !== '>',
      );

      let position = currentScene - 1;

      scenesSource.forEach((sceneSource) => {
        const lines = sceneSource.split('\n');

        const firstLine = lines[0].trim();

        if (/^\d/.exec(firstLine)) {
          position = parseFloat(firstLine);
          lines.shift();
        } else {
          position += 1;
        }

        const scene = { scene: position };

        scene.markup = MarkupParser.parse(lines.join('\n'));

        const filteredMarkup = {};

        Object.keys(scene.markup).forEach((key) => {
          if (!/^#/.exec(key)) {
            filteredMarkup[key] = scene.markup[key];
          } else {
            if (ast.leakedBaseMarkup[key] === undefined) {
              ast.leakedBaseMarkup[key] = {};
            }

            Object.keys(scene.markup[key]).forEach((name) => {
              ast.leakedBaseMarkup[key][name] = scene.markup[key][name];
            });
          }
        });

        scene.markup = filteredMarkup;

        ast.scenes.push(scene);
      });
    }

    if (ast.scenes[0] !== undefined) {
      if (ast.stage !== undefined) {
        ast.stage.scene = ast.scenes[0].scene;
      }
      ast.firstScene = ast.scenes[0].scene;
      ast.lastScene = ast.scenes.slice(-1)[0].scene;
    } else {
      if (ast.stage !== undefined) {
        ast.stage.scene = currentScene;
      }
      ast.firstScene = currentScene;
      ast.lastScene = currentScene;
    }

    return ast;
  }
}

export default SectionParser;
