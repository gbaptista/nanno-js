import ParserHelper from './helper';

class MovieParser {
  static parse(source) {
    const ast = { sections: [], markup: [] };

    source.split(/^-{1,}/gm).forEach((sectionSource) => {
      const parts = sectionSource.split(/^(>|scene|\^|movie)/m);
      const stage = parts.shift();
      let markup = '';

      parts.forEach((part, i) => {
        if (parts[i + 1] !== undefined && parts[i + 1].trim() !== '') {
          if (part.trim() === '>' || part.trim() === 'scene') {
            markup += part + parts[i + 1];
          } else if (part.trim() === '^' || part.trim() === 'movie') {
            ast.markup.push(part + parts[i + 1]);
          }
        }
      });

      markup = ParserHelper.removeVoids(markup);

      const section = {};

      let validSection = false;

      if (stage !== undefined && stage.trim() !== '') {
        validSection = true;
        section.stage = ParserHelper.removeVoids(stage);
      }

      if (markup !== undefined && markup.trim() !== '') {
        validSection = true;
        section.markup = ParserHelper.removeVoids(markup);
      }

      if (validSection) {
        section.position = ast.sections.length + 1;
        ast.sections.push(section);
      }
    });

    ast.markup = ParserHelper.removeVoids(
      ast.markup.join('\n').split(/^movie|^\^/m).join('\n'),
    );

    return ast;
  }
}

export default MovieParser;
