import Setup from './setup';
import Element from './element';

const PROPERTIES = {
  element: {
    'background-color': 'fillColor',
  },
  text: {
    'text-color': 'tint',
  },
};

class Controller {
  constructor(target, ast, dependencies, callbacks) {
    this.target = target;
    this.scenes = ast.scenes;
    this.markup = ast.markup;
    this.dependencies = dependencies;
    this.resources = ast.resources;
    this.callbacks = callbacks;

    if (this.callbacks === undefined) {
      this.callbacks = {};
    }

    this.library = {};
  }

  setup() {
    Setup.player(this);
  }

  render() {
    if (this.resources.fonts.length === 0 || this.dependencies.font === undefined) {
      this.renderTimeline();
    } else {
      const fontsToLoad = [];

      const Font = this.dependencies.font;

      this.resources.fonts.forEach((fontName) => {
        const font = new Font(fontName);
        fontsToLoad.push(font);
      });

      const fontTimeout = undefined; // Default

      Promise.all(fontsToLoad.map((f) => f.load(null, fontTimeout))).then(() => {
        this.renderTimeline();
      }).catch((err) => {
        throw new Error(
          `Fonts are not available: [${this.resources.fonts.join(', ')}]: ${err}`,
        );
      });
    }
  }

  renderTimeline() {
    let repeat = this.markup['#player']['repeat?'];

    if (repeat === true) {
      repeat = -1;
    }

    const timelineSettings = {
      repeat, repeatDelay: 0, yoyo: this.markup['#player']['rewind?'],
    };

    if (this.callbacks.recorderFinish !== undefined) {
      this.recorderFinished = false;

      if (repeat !== false && this.markup['#player']['rewind?']) {
        if (repeat === 1) {
          timelineSettings.onComplete = () => {
            if (!this.recorderFinished) {
              this.recorderFinished = true;
              this.callbacks.recorderFinish();
            }
          };
        } else {
          this.recorderWaiting = 0;
          timelineSettings.onRepeat = () => {
            if (!this.recorderFinished && this.recorderWaiting === 1) {
              this.recorderFinished = true;
              this.callbacks.recorderFinish();
            } else {
              this.recorderWaiting += 1;
            }
          };
        }
      } else if (repeat !== false && !this.markup['#player']['rewind?']) {
        timelineSettings.onRepeat = () => {
          if (!this.recorderFinished) {
            this.recorderFinished = true;
            this.callbacks.recorderFinish();
          }
        };
      } else {
        timelineSettings.onComplete = () => {
          if (!this.recorderFinished) {
            this.recorderFinished = true;
            this.callbacks.recorderFinish();
          }
        };
      }
    }

    this.timeline = this.dependencies.gsap.timeline(timelineSettings);

    // TODO: Pause on focus out for performance reasons?
    this.timeline.pause();

    const edgesDuration = 0.2;

    const self = this;

    this.timeline.add(() => {
      Object.keys(self.library).forEach((key) => {
        if (self.library[key].raisedAt !== 'scene1') {
          self.library[key].object.container.visible = false;
        } else {
          self.library[key].object.container.visible = true;
        }
      });

      self.mainContainer.visible = true;
    });

    this.timeline.to({}, edgesDuration, {});

    this.scenes.forEach((scene, i) => {
      const sceneKey = `scene${i + 1}`;

      this.renderScene(scene, sceneKey);
    });

    if (this.callbacks.recorderSetup !== undefined) {
      this.callbacks.recorderSetup();
    }

    this.timeline.to({}, edgesDuration, {});

    if (this.callbacks.recorderStart !== undefined) {
      this.callbacks.recorderStart();
    }

    this.timeline.play();
  }

  renderScene(scene, sceneKey) {
    scene.forEach((element) => {
      const exists = Element.ensure(this, element, sceneKey);

      const item = this.library[element.id];
      const { object } = item;

      if (!exists && sceneKey !== 'scene1') {
        this.timeline.add(() => { object.container.visible = false; }, sceneKey);
        this.timeline.add(() => { object.container.visible = true; }, sceneKey);
      }

      const containerTarget = {
        x: this.descartes.xFor(element.markup.column),
        y: this.descartes.yFor(element.markup.row),
      };

      if (element.markup.motion === 'show') {
        containerTarget.scale = 1;
      } else if (element.markup.motion === 'hide') {
        containerTarget.scale = 0;
      }

      if (element.markup['text-content'] !== undefined) {
        this.timeline.add(() => {
          Element.updateText(object.text, element.markup['text-content']);
        });
      }

      this.timeline.to(
        object.container,
        { duration: 0.8, ease: 'power4.out', pixi: containerTarget },
        sceneKey,
      );

      const graphicTarget = {};

      Object.keys(PROPERTIES.element).forEach((key) => {
        if (element.markup[key] !== undefined) {
          graphicTarget[PROPERTIES.element[key]] = element.markup[key];
        }
      });

      if (object.graphic !== undefined && Object.keys(graphicTarget).length > 0) {
        this.timeline.to(
          object.graphic,
          { duration: 0.8, ease: 'power4.out', pixi: graphicTarget },
          sceneKey,
        );
      }

      const textTarget = {};

      Object.keys(PROPERTIES.text).forEach((key) => {
        if (element.markup[key] !== undefined) {
          textTarget[PROPERTIES.text[key]] = element.markup[key];
        }
      });

      if (object.text !== undefined && Object.keys(textTarget).length > 0) {
        this.timeline.to(
          object.text,
          { duration: 0.8, ease: 'power4.out', pixi: textTarget },
          sceneKey,
        );
      }

      if (element.markup['text-content'] === undefined && item.previousContent !== undefined) {
        const returnTo = item.previousContent;

        this.timeline.add(() => { Element.updateText(object.text, returnTo); });
      } else if (element.markup['text-content'] !== undefined) {
        this.timeline.add(() => { Element.updateText(object.text, element.markup['text-content']); });

        item.previousContent = element.markup['text-content'];
      }
    });
  }
}

export default Controller;
