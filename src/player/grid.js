class Grid {
  static draw(stage, targetContainer, pixi) {
    const color = 0xffffff;
    const gridContainer = new pixi.Container();

    const xPerColumn = stage.width / (stage.columns + 1);
    const yPerLine = stage.height / (stage.rows + 1);

    for (let i = 0; i < stage.rows; i += 1) {
      const line = i + 1;

      const rule = new pixi.Graphics();
      gridContainer.addChild(rule);

      const startX = 0;
      const startY = yPerLine * line;

      const endX = stage.width;
      const endY = yPerLine * line;

      rule.position.set(0, 0);

      rule.lineStyle(0.5, color).moveTo(startX, startY).lineTo(endX, endY);
    }

    for (let i = 0; i < stage.columns; i += 1) {
      const column = i + 1;

      const rule = new pixi.Graphics();
      gridContainer.addChild(rule);

      const startX = xPerColumn * column;
      const startY = 0;

      const endX = xPerColumn * column;
      const endY = stage.height;

      rule.position.set(0, 0);

      rule.lineStyle(0.5, color).moveTo(startX, startY).lineTo(endX, endY);
    }

    targetContainer.addChild(gridContainer);
  }
}

export default Grid;
