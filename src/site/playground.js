/* eslint-disable */
 
import * as PIXILegacy from 'pixi.js-legacy';
import * as PIXI from 'pixi.js';

import gsap from 'gsap';
import PixiPlugin from 'gsap/PixiPlugin';

import FontFaceObserver from 'fontfaceobserver';

import * as monaco from 'monaco-editor';
import Nanno from '../nanno';
import Recorder from './recorder';
import MonacoNanno from './monaco-nanno';

const nanno = new Nanno({
  pixi: PIXI,
  pixiLegacy: PIXILegacy,
  gsap,
  gsapPixiPlugin: PixiPlugin,
  font: FontFaceObserver,
});

// const recorder = new Recorder();

const ANIMATION_PATH = `/nanno-js/animations/playground/${document.getElementById('examples').value}`;

const animationElement = document.getElementById('animation');

nanno.renderFile(
  ANIMATION_PATH,
  animationElement,
  // {
  //   recorderSetup: () => {
  //     const canvasElement = document.getElementById('main-animation')
  //       .getElementsByTagName('canvas')[0];

  //     const videoElement = document.getElementById('main-animation-video')
  //       .getElementsByTagName('video')[0];

  //     recorder.setup(canvasElement, videoElement);
  //   },
  //   recorderStart: () => { recorder.start(); },
  //   recorderFinish: () => { recorder.finish(); },
  // },
);

MonacoNanno.register(monaco);

fetch(ANIMATION_PATH, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
  .then((response) => response.text())
  .then((content) => {
    const editor = monaco.editor.create(document.getElementById('source-editor'), {
      theme: 'nanno-theme',
      value: content,
      language: 'nanno',
      minimap: { enabled: false },
      fontSize: '20px',
      automaticLayout: true,
    });

    editor.addAction({
      id: 'render-nanno',
      label: 'Render Animation',
      keybindings: [
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S,
        // monaco.KeyMod.chord(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_K, monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_M)
      ],
      precondition: null,
      keybindingContext: null,
      contextMenuGroupId: 'navigation',
      contextMenuOrder: 1.5,
      run() {
        const canvasElement = animationElement.getElementsByTagName('canvas')[0];
        canvasElement.remove();
        nanno.render(editor.getValue(), animationElement);
        return null;
      },
    });

    document.getElementById('examples').addEventListener('change', () => {
      const { value } = document.getElementById('examples');

      fetch(`/nanno-js/animations/playground/${value}`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
        .then((response) => response.text())
        .then((contentSource) => {
          editor.setValue(contentSource);

          const canvasElement = animationElement.getElementsByTagName('canvas')[0];

          canvasElement.remove();

          nanno.render(contentSource, animationElement);
        });
    });

    document.getElementById('render').addEventListener('click', () => {
      const canvasElement = animationElement.getElementsByTagName('canvas')[0];

      canvasElement.remove();

      nanno.render(editor.getValue(), animationElement);
    });
  })
  .catch((error) => { throw error; });
