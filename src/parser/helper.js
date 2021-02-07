class ParserHelper {
  static removeVoids(content) {
    const lines = [];

    content.split('\n').forEach((line) => {
      if (line.trim() !== '') {
        lines.push(ParserHelper.rightTrim(line));
      }
    });

    return lines.join('\n');
  }

  static rightTrim(content) {
    return content.replace(/\s+$/, '');
  }
}

export default ParserHelper;
