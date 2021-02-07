import Grid from './grid';
import Descartes from './descartes';

class Setup {
  static player(referenceController) {
    const controller = referenceController;

    controller.app = Setup.app(
      controller.target, controller.markup['#stage'], controller.dependencies,
    );

    controller.descartes = new Descartes(controller.markup['#stage']);

    controller.mainContainer = new controller.dependencies.pixi.Container();

    controller.mainContainer.visible = false;

    controller.app.stage.addChild(controller.mainContainer);

    if (controller.markup['#stage']['show-grid?']) {
      Grid.draw(
        controller.markup['#stage'],
        controller.mainContainer,
        controller.dependencies.pixi,
      );
    }
  }

  static buildApplication(settings, dependencies) {
    let app;

    try {
      app = new dependencies.pixi.Application(settings);
    } catch (_) {
      app = new dependencies.pixiLegacy.Application(settings);
    }

    return app;
  }

  static app(target, stage, dependencies) {
    const settings = {
      width: stage.width,
      height: stage.height,
      antialias: true,
      autoResize: true,
      backgroundColor: stage['background-color'],
    };

    const app = Setup.buildApplication(settings, dependencies);

    target.appendChild(app.view);

    return app;
  }
}

export default Setup;
