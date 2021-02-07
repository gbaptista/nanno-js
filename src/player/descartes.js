class Descartes {
  constructor(stageMarkup) {
    this.xPerColumn = stageMarkup.width / (stageMarkup.columns + 1);
    this.yPerRow = stageMarkup.height / (stageMarkup.rows + 1);
  }

  xFor(column) {
    return this.xPerColumn * column;
  }

  yFor(row) {
    return this.yPerRow * row;
  }
}

export default Descartes;
