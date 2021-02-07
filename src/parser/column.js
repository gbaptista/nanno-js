class ColumnParser {
  static parse(source) {
    const coordinates = {};

    let pendingPositions = [];

    let previousColumn;
    let column = '';

    source.split('').forEach((char, position) => {
      pendingPositions.push(position);

      if (char.trim() === '' && column !== '') {
        column = ColumnParser.translateColumn(column, previousColumn);

        previousColumn = column;

        pendingPositions.forEach((pendingPosition) => {
          coordinates[pendingPosition] = column;
        });

        pendingPositions = [];

        column = '';
      } else if (char !== ' ' && char !== '') {
        column += char;
      }
    });

    column = ColumnParser.translateColumn(column, previousColumn);

    pendingPositions.forEach((pendingPosition) => {
      coordinates[pendingPosition] = column;
    });

    const columns = Object.values(coordinates).map((value) => parseFloat(value));

    const firstColumn = Math.min(...columns);
    const lastColumn = Math.max(...columns);
    const numberOfColumns = Math.ceil(lastColumn);

    const ast = {
      firstColumn, lastColumn, numberOfColumns, coordinates,
    };

    return ast;
  }

  static translateColumn(column, previousColumn) {
    if (column === '.') {
      if (previousColumn === undefined) {
        return 1.0;
      }
      return Math.floor(previousColumn) + 1.0;
    }
    return parseFloat(column);
  }
}

export default ColumnParser;
