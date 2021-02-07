class Injector {
  constructor(dependencies) {
    Injector.validate(dependencies, 'pixi', 'Application');
    Injector.validate(dependencies, 'gsap', 'registerPlugin');
    Injector.validate(dependencies, 'gsapPixiPlugin', 'registerPIXI');

    Injector.validateFont(dependencies.font);

    dependencies.gsapPixiPlugin.registerPIXI(dependencies.pixi);
    dependencies.gsap.registerPlugin(dependencies.gsapPixiPlugin);

    return dependencies;
  }

  static validate(dependencies, objectKey, functionKey) {
    if (typeof (dependencies[objectKey]) !== 'object') {
      throw new Error(`Missing ${objectKey} dependency.`);
    }

    if (typeof (dependencies[objectKey][functionKey]) !== 'function') {
      throw new Error(`Injected ${objectKey} is not valid. Missing function ${functionKey}.`);
    }
  }

  static validateFont(dependency) {
    if (typeof (dependency) !== 'function') {
      throw new Error('Invalid font dependency.');
    }
  }
}

export default Injector;
