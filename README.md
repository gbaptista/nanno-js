# nanno-js

A JavaScript implementation of the **nanno** language.

It provides a compiler for the source code and a player that runs on [canvas](https://html.spec.whatwg.org/multipage/canvas.html) and [WebGL 2](https://www.khronos.org/registry/webgl/specs/latest/2.0/).

Powered by [PixiJS](https://www.pixijs.com/), [GSAP](https://greensock.com/gsap/) and [Font Face Observer](https://fontfaceobserver.com/).

> _**Warning:** The **nanno** language is in the early stages. You should expect some breaking-changes in the language specification during this period._

- [Getting Started](#getting-started)
  - [Online Playground](#online-playground)
  - [JavaScript imports usage](#javascript-imports-usage)
  - [JavaScript standalone usage](#javascript-standalone-usage)
- [Development](#development)

## Getting Started

### Online Playground
Try the [Online Playground](https://gbaptista.github.io/nanno-js/playground.html): You can check out several examples and render your source code right away.

![nanno Language Playground](https://raw.githubusercontent.com/gbaptista/nanno-js/main/site/nanno-js/images/screen.png "nanno Language Playground")

### JavaScript imports usage

Check the [demonstration](https://gbaptista.github.io/nanno-js/demo-import.html).

You can use `npm` or `yarn`.

_Setup:_
```bash
yarn add nanno \
         pixi.js pixi.js-legacy \
         gsap fontfaceobserver
```

_HTML:_
```html
<div id="animation-container"></div>
<script src="/your-bundle.js"></script>
```

_JavaScript:_
```js
import * as PIXI from 'pixi.js';
import * as PIXILegacy from 'pixi.js-legacy';
import gsap from 'gsap';
import PixiPlugin from 'gsap/PixiPlugin';
import FontFaceObserver from 'fontfaceobserver';

import Nanno from 'nanno';

const nanno = new Nanno({
  pixi: PIXI, pixiLegacy: PIXILegacy,
  gsap, gsapPixiPlugin: PixiPlugin,
  font: FontFaceObserver,
});

nanno.renderFile(
  'animation-source.nn',
  document.getElementById('animation-container'),
);
```

### JavaScript standalone usage

Check the [demonstration](https://gbaptista.github.io/nanno-js/demo-standalone.html).

_HTML:_
```html
<div id="animation-container"></div>

<script src="pixi.js/5.1.3/pixi.min.js"></script>

<script src="gsap/3.6.0/gsap.min.js"></script>
<script src="gsap/3.6.0/PixiPlugin.min.js"></script>
<script src="fontfaceobserver.standalone.js"></script>

<script src="nanno-standalone.js"></script>
```

_JavaScript_
```js
const nanno = new Nanno({
  pixi: PIXI,
  gsap, gsapPixiPlugin: PixiPlugin,
  font: FontFaceObserver,
});

nanno.renderFile(
  'animation-source.nn',
  document.getElementById('animation-container'),
);
```

## Development

```bash
bundle exec guard

yarn run webpack --env NODE_ENV=development
yarn run webpack --env NODE_ENV=production

python -m http.server 8000 --directory site

yarn test
yarn lint

npm pack
npm install --local nanno-0.0.1.tgz
```
