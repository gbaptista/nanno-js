/* eslint-disable */

import * as PIXILegacy from 'pixi.js-legacy';
import * as PIXI from 'pixi.js';

import gsap from 'gsap';
import PixiPlugin from 'gsap/PixiPlugin';

import FontFaceObserver from 'fontfaceobserver';

import Nanno from '../nanno';

console.log(`nanno ${Nanno.VERSION}`);

const nanno = new Nanno({
  pixi: PIXI,
  pixiLegacy: PIXILegacy,
  gsap,
  gsapPixiPlugin: PixiPlugin,
  font: FontFaceObserver,
});

nanno.renderFile(
  '/nanno-js/animations/playground/animation-8.nn',
  document.getElementById('animation-container'),
);
