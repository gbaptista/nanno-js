import Circle from './graphics/circle';
import Text from './graphics/text';
import CircleText from './graphics/circle_text';

class Element {
  static ensure(referenceController, element, sceneKey) {
    const controller = referenceController;

    if (controller.library[element.id]) return true;

    let build;

    const textContent = element.markup['text-content'];

    if (textContent !== undefined && textContent.length > 1) {
      build = Text.draw(element, controller.dependencies.pixi);
    } else if (textContent !== undefined) {
      build = CircleText.draw(element, controller.dependencies.pixi);
    } else {
      build = Circle.draw(element, controller.dependencies.pixi);
    }

    controller.library[element.id] = { raisedAt: sceneKey, object: build };

    const { object } = controller.library[element.id];

    object.container.x = controller.descartes.xFor(element.markup.column);
    object.container.y = controller.descartes.yFor(element.markup.row);

    if (sceneKey !== 'scene1') {
      object.container.visible = false;
    }

    if (element.markup.motion === 'show') {
      object.container.scale = 0;
    }

    controller.mainContainer.addChild(object.container);

    return false;
  }

  static updateText(textObjectReference, text) {
    const textObject = textObjectReference;
    textObject.text = text;

    textObject.x = -(textObject.width / 2);
    textObject.y = -(textObject.height / 2);
  }
}

export default Element;
