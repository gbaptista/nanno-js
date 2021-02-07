import MovieParser from './01-movie';
import SectionParser from './03-section';
import MarkupParser from './markup';
import FlowParser from './flow';

class Expander {
  static parse(source) {
    const ast = MovieParser.parse(source);

    let columnMap;

    let previousScene = 0;
    let lastScene = 0;
    let lastColumn = 0;
    let lastRow = 0;

    const result = { scenes: [], stages: [], meta: {} };

    const leakedBaseMarkups = [];

    if (ast.sections !== undefined) {
      ast.sections.forEach((sectionSource) => {
        const section = SectionParser.parse(
          sectionSource, previousScene, columnMap,
        );

        leakedBaseMarkups.push(section.leakedBaseMarkup);

        columnMap = section.columnMap;
        previousScene = section.lastScene;

        if (section.columnMap && section.columnMap.lastColumn > lastColumn) {
          lastColumn = section.columnMap.lastColumn;
        }

        if (section.lastScene > lastScene) {
          lastScene = section.lastScene;
        }

        if (section.lastRow !== undefined && section.lastRow > lastRow) {
          lastRow = section.lastRow;
        }

        if (section.scenes !== undefined && section.scenes.length > 0) {
          result.scenes.push(...section.scenes);
        }

        if (section.stage !== undefined) {
          result.stages.push(section.stage);
        }
      });
    }

    result.markup = MarkupParser.parse(ast.markup);

    leakedBaseMarkups.forEach((leakedBaseMarkup) => {
      Object.keys(leakedBaseMarkup).forEach((id) => {
        if (result.markup[id] === undefined) result.markup[id] = {};

        Object.keys(leakedBaseMarkup[id]).forEach((name) => {
          if (result.markup[id][name] === undefined) {
            result.markup[id][name] = leakedBaseMarkup[id][name];
          }
        });
      });
    });

    const pendingFlows = [];

    result.scenes.forEach((scene) => {
      Object.keys(scene.markup).forEach((id) => {
        let flowPreviousScene = 0;

        if (scene.scene !== undefined) flowPreviousScene = scene.scene - 1;

        if (scene.markup[id].flow !== undefined) {
          const flow = FlowParser.parse(scene.markup[id].flow, flowPreviousScene);

          flowPreviousScene = flow.previousScene;

          pendingFlows.push({ id, timeline: flow.timeline });

          delete scene.markup[id].flow; // eslint-disable-line no-param-reassign

          if (Object.keys(scene.markup[id]).length === 0) {
            delete scene.markup[id]; // eslint-disable-line no-param-reassign
          }
        }
      });
    });

    Object.keys(result.markup).forEach((id) => {
      let flowPreviousScene = 0;

      if (result.markup[id].flow !== undefined) {
        const flow = FlowParser.parse(result.markup[id].flow, flowPreviousScene);

        flowPreviousScene = flow.previousScene;

        pendingFlows.push({ id, timeline: flow.timeline });

        delete result.markup[id].flow;

        if (Object.keys(result.markup[id]).length === 0) {
          delete result.markup[id];
        }
      }
    });

    pendingFlows.forEach((flow) => {
      flow.timeline.forEach((target) => {
        // TODO: Are we sure that scenes are ordered?
        // TODO: Order scenes before this...
        const sceneIndex = target.scene - 1;

        if (target.scene > lastScene) {
          lastScene = target.scene;
        }

        if (result.scenes[sceneIndex] === undefined) {
          result.scenes[sceneIndex] = { scene: target.scene, markup: {} };
        }

        if (result.scenes[sceneIndex].markup[flow.id] === undefined) {
          result.scenes[sceneIndex].markup[flow.id] = {};
        }

        Object.keys(target).forEach((property) => {
          if (property !== 'scene') {
            result.scenes[sceneIndex].markup[flow.id][property] = target[property];

            if (property === 'row' && target[property] > lastRow) {
              lastRow = target[property];
            }

            if (property === 'column' && target[property] > lastColumn) {
              lastColumn = target[property];
            }
          }
        });
      });
    });

    result.meta.lastScene = lastScene;
    result.meta.lastColumn = lastColumn;
    result.meta.lastRow = lastRow;

    Object.keys(result.markup).forEach((id) => {
      if (!/^#|^\*/.exec(id)) {
        let limbo = true;

        result.scenes.forEach((scene) => {
          if (Object.keys(scene.markup).includes(id)) {
            limbo = false;
          }
        });

        result.stages.forEach((stage) => {
          stage.elements.forEach((element) => {
            if (element.id === id) {
              limbo = false;
            }
          });
        });

        if (limbo === true) {
          if (result.scenes[0] === undefined) {
            result.scenes[0] = { scene: 1, markup: {} };
          }

          result.scenes[0].markup[id] = result.markup[id];

          delete result.markup[id];
        }
      }
    });

    return result;
  }
}

export default Expander;
