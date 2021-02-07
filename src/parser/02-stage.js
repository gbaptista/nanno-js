import ParserHelper from './helper';
import ColumnParser from './column';

class StageParser {
  static parse(source, referenceColumnMap) {
    const ast = { elements: [] };

    let columnMap = referenceColumnMap;

    const lines = ParserHelper.removeVoids(source).split('\n');

    const prefixes = StageParser.buildLinePrefixes(lines);

    if (columnMap === undefined && !prefixes.includes('column')) {
      throw new Error('Column map missing.');
    }

    let currentRow = 0;

    lines.forEach((line, index) => {
      const prefix = prefixes[index];

      let result;

      switch (prefix) {
        case 'column':
          columnMap = ColumnParser.parse(line);
          break;
        case 'row':
          result = StageParser.parseLine(line, currentRow, columnMap);
          currentRow = result.currentRow;

          if (result.tokens.length > 0) {
            ast.elements.push(...result.tokens);
          }
          break;
        default:
          throw new Error(`Unknown scene instruction: ${prefix}`);
      }
    });

    ast.lastRow = currentRow;
    ast.columnMap = columnMap;

    return ast;
  }

  static parseLine(line, currentRow, columnMap) {
    let tokens = line;

    let row = Math.floor(currentRow) + 1.0;

    const rowToken = /^\d+\.?\d*/.exec(tokens);

    if (rowToken) {
      row = parseFloat(rowToken[0]);
      tokens = tokens.replace(/^\d+\.?\d*/, ' '.repeat(rowToken[0].length));
    } else {
      tokens = tokens.replace(/^\./, ' ');
    }

    const ast = { currentRow: row, tokens: [] };

    const tokensRegex = /(↧|⊹|↥)*(\w+[:/|]".*?"|\w+[:/|]'.*?'|".*?"|'.*?'|\w+[:/|]\w+|\w+)(↧|⊹|↥)*/;

    let keepSearching = true;

    while (keepSearching) {
      const result = tokensRegex.exec(tokens);

      if (result) {
        tokens = tokens.replace(tokensRegex, ' '.repeat(result[0].length));

        const token = result[0];
        let columnPosition = result.index;

        if (result[0].match(/↧|⊹|↥/)) {
          columnPosition += 1;
        }

        ast.tokens.push({
          token,
          row,
          column: StageParser.positionToColumn(columnPosition, columnMap),
        });
      } else {
        keepSearching = false;
      }
    }

    return ast;
  }

  static positionToColumn(position, map) {
    let column = map.coordinates[position];

    if (column === undefined) column = map.lastColumn;

    return column;
  }

  static buildLinePrefixes(lines) {
    return lines.map((line) => {
      if (/\d|\./.test(line[0])) {
        return 'row';
      } if (/\s/.test(line[0])) {
        return 'column';
      }
      throw new Error(`Unknown scene instruction: ${line[0]}`);
    });
  }
}

export default StageParser;
