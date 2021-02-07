import Expander from './04-expander';
import ColorParser from './color';

const BASE_MARKUP = {
  '*': {
    'text-color': 'black',
    'background-color': 'white',
  },
  '#stage': {
    'background-color': 'black',
    width: 600,
    height: 400,
    'show-grid?': false,
  },
  '#player': {
    'repeat?': false,
    'rewind?': false,
  },
};

class SourceParser {
  static parse(source) {
    const expanded = Expander.parse(source);

    const result = { scenes: [], markup: {} };

    const markup = JSON.parse(JSON.stringify(BASE_MARKUP));

    Object.keys(markup).forEach((id) => {
      Object.keys(markup[id]).forEach((property) => {
        if (/color/.exec(property)) {
          markup[id][property] = ColorParser.parse(markup[id][property]);
        }
      });
    });

    markup['#stage'].columns = expanded.meta.lastColumn;
    markup['#stage'].rows = expanded.meta.lastRow;

    const builderMarkup = { ...markup };
    const finalMarkup = { ...markup };

    Object.keys(expanded.markup).forEach((key) => {
      if (builderMarkup[key] === undefined) builderMarkup[key] = {};

      Object.keys(expanded.markup[key]).forEach((name) => {
        builderMarkup[key][name] = expanded.markup[key][name];
      });

      if (/^#/.exec(key)) {
        if (finalMarkup[key] === undefined) finalMarkup[key] = {};

        Object.keys(expanded.markup[key]).forEach((name) => {
          finalMarkup[key][name] = expanded.markup[key][name];
        });
      }
    });

    result.markup = finalMarkup;

    const scenes = {};

    const elementCreated = {};

    expanded.stages.forEach((stage) => {
      const sceneKey = stage.scene.toString();

      if (scenes[sceneKey] === undefined) scenes[sceneKey] = {};

      stage.elements.forEach((element) => {
        const { id } = element;
        if (scenes[sceneKey][id] === undefined) {
          scenes[sceneKey][id] = {
            markup: SourceParser.buildBaseMarkupFor(id, builderMarkup, elementCreated),
          };
        }

        scenes[sceneKey][id].markup.row = element.row;
        scenes[sceneKey][id].markup.column = element.column;

        Object.keys(element.markup).forEach((key) => {
          scenes[sceneKey][id].markup[key] = element.markup[key];
        });
      });
    });

    expanded.scenes.forEach((scene) => {
      const sceneKey = scene.scene.toString();

      if (scenes[sceneKey] === undefined) scenes[sceneKey] = {};

      Object.keys(scene.markup).forEach((id) => {
        if (id !== '*') {
          if (scenes[sceneKey][id] === undefined) {
            scenes[sceneKey][id] = {
              markup: SourceParser.buildBaseMarkupFor(id, builderMarkup, elementCreated),
            };
          }

          if (scene.markup['*'] !== undefined) {
            Object.keys(scene.markup['*']).forEach((key) => {
              scenes[sceneKey][id].markup[key] = scene.markup['*'][key];
            });
          }

          Object.keys(scene.markup[id]).forEach((key) => {
            scenes[sceneKey][id].markup[key] = scene.markup[id][key];
          });
        }
      });
    });

    const sceneKeys = Object.keys(scenes)
      .map((i) => parseInt(i, 10))
      .sort()
      .map((i) => i.toString());

    sceneKeys.forEach((sceneKey) => {
      const items = [];

      Object.keys(scenes[sceneKey]).forEach((id) => {
        const item = scenes[sceneKey][id];
        item.id = id;
        items.push(item);
      });

      result.scenes.push(items);
    });

    delete result.markup['*'];

    result.resources = { fonts: [] };

    result.scenes.forEach((scene) => {
      scene.forEach((element) => {
        Object.keys(element.markup).forEach((property) => {
          if (property === 'text-font') {
            if (!result.resources.fonts.includes(element.markup[property])) {
              result.resources.fonts.push(element.markup[property]);
            }
          }
        });
      });
    });

    return result;
  }

  static buildBaseMarkupFor(id, baseMarkup, elementCreated) {
    const markup = {};

    if (elementCreated[id]) return markup;

    if (baseMarkup['*'] !== undefined) {
      Object.keys(baseMarkup['*']).forEach((key) => {
        markup[key] = baseMarkup['*'][key];
      });
    }

    if (baseMarkup[id] !== undefined) {
      Object.keys(baseMarkup[id]).forEach((key) => {
        markup[key] = baseMarkup[id][key];
      });
    }

    elementCreated[id] = true; // eslint-disable-line no-param-reassign

    return markup;
  }
}

export default SourceParser;
