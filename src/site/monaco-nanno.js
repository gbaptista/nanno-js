/* eslint-disable */
 
class MonacoNanno {
  static register(monaco) {
    monaco.languages.register({ id: 'nanno', exclusive: true });

    monaco.languages.setMonarchTokensProvider('nanno', {
      tokenizer: {
        root: [
          ['↥', 'prefix.nanno'],
          ['↧', 'prefix.nanno'],
          [/(\d+)([\.\/]*)(\d*)/, ['constant.nanno', 'prefix.nanno', 'constant.nanno']],
          [/\./, 'constant.nanno'],
          [/^-.*/, 'separator.nanno'],
          [/(\w+)([\/:])(")(.*)?(")/, ['source', 'prefix.nanno', 'prefix.nanno', 'property.value.nanno', 'prefix.nanno']],
          [/(\w+)([\/:])(\S+)/, ['source', 'prefix.nanno', 'property.value.nanno']],
          [/^(movie|\^|\>|scene)/, 'section.nanno', 'markdown'],
        ],
        markdown: [
          [/^(movie|\^|\>|scene)/, 'section.nanno', 'markdown'],
          [/^\#/, 'prefix.nanno', 'identifier'],
          [/^[\w\*]/, 'identifier.nanno', 'identifier'],
          [/^-.*/, 'separator.nanno', 'root'],
        ],
        flow: [
          [/^(movie|\^|scene)/, 'section.nanno', 'markdown'],
          [/\[/, 'prefix.nanno'],
          [/\>/, 'section.nanno', 'flow'],
          [/(\d+)([\.\/]*)(\d*)/, ['constant.nanno', 'prefix.nanno', 'constant.nanno']],
          [/(\S+)(\s+)(")(.*)?(")/, ['property.name.nanno', 'empty', 'prefix.nanno', 'property.value.nanno', 'prefix.nanno']],
          [/(\S+)(\s+)(\d+)([\.\/]*)(\d*)/, ['property.name.nanno', 'empty', 'constant.nanno', 'prefix.nanno', 'constant.nanno']],
          [/(\S+)(\s+)(true|false|yes|no)/, ['property.name.nanno', 'empty', 'constant.nanno']],
          [/(\S+)(\s+)(\S+)/, ['property.name.nanno', 'empty', 'property.value.nanno']],
          [/\]/, 'prefix.nanno', 'properties'],
        ],
        properties: [
          [/^(movie|\^|\>|scene)/, 'section.nanno', 'markdown'],
          [/^-.*/, 'separator.nanno', 'root'],
          [/^\#/, 'prefix.nanno', 'identifier'],
          [/^[\w\*]/, 'identifier.nanno', 'identifier'],
          [/flow/, 'property.name.nanno', 'flow'],
          [/(\S+)(\s+)(")(.*)?(")/, ['property.name.nanno', 'empty', 'prefix.nanno', 'property.value.nanno', 'prefix.nanno']],
          [/(\S+)(\s+)(\d+)([\.\/]*)(\d*)/, ['property.name.nanno', 'empty', 'constant.nanno', 'prefix.nanno', 'constant.nanno']],
          [/(\S+)(\s+)(true|false|yes|no)/, ['property.name.nanno', 'empty', 'constant.nanno']],
          [/(\S+)(\s+)(\S+)/, ['property.name.nanno', 'empty', 'property.value.nanno']],
        ],
        identifier: [
          [/^(movie|\^|\>|scene)/, 'section.nanno', 'markdown'],
          [/\#/, 'prefix.nanno'],
          [/\w+/, 'identifier.nanno'],
          [/^\s/, 'empty.nanno', 'properties'],
          [/^-.*/, 'separator.nanno', 'root'],
        ],
      },
    });

    monaco.editor.defineTheme('nanno-theme', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'constant.nanno', foreground: 'f78c6c' },
        { token: 'separator.nanno', foreground: '4a4a4a' },
        { token: 'section.nanno', foreground: 'c792ea' },
        { token: 'identifier.nanno', foreground: 'f07178' },
        { token: 'prefix.nanno', foreground: '89ddff' },
        { token: 'property.name.nanno', foreground: 'ffcb6b' },
        { token: 'property.value.nanno', foreground: 'c3e88d' },
      ],
    });
  }
}

export default MonacoNanno;
