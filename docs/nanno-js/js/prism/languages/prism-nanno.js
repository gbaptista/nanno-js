const nannoKeywords = 'string=|format|reverse|string-right-trim|string-left-trim|replace|subseq|>|unless|char|remove|substitute|substitute-if|map|string-upcase|string-downcase|string-capitalize|string-trim|search|upper-case-p|length|string|function|apply|funcall|lambda|inspect|dolist|mod|setf|sqrt|concatenate|expt|exp|ceiling|floor|round|defvar|quote|describe|null|defconstant|defparameter|print|=|when|if|car|cdr|write-line|write-to-string'
const nannoOperators = '(\\+|\\-|/|&optional|&rest|&key|\\*)'

const nannoFunctions = nannoKeywords + '|' + nannoOperators

Prism.languages.nanno = { // eslint-disable-line no-undef
  comment: /;.*/,
  string: {
    pattern: /"(?:[^"\\]|\\.)*"/,
    inside: {
      quote: /"/,
      escape: /\\./
    },
    greedy: true
  },
  operator: {
    pattern: /([:|'])\b[a-z][(\w|/)*+!?-]*\b/i,
    inside: { colon: /:/ }
  },
  keyword: {
    pattern: new RegExp("([^\\w+*'?-])(?:" + nannoFunctions + ")(?=[^\\w+*'?-])"), // eslint-disable-line prefer-regex-literals
    lookbehind: true
  },
  let: {
    pattern: new RegExp("([^\\w+*'?-])(?:let)(?=[^\\w+*'?-])"), // eslint-disable-line prefer-regex-literals
    lookbehind: true
  },
  definition: {
    pattern: /([^\w+*'?-])((?:defun)+?\s.*?\s)(?=[^\w+*'?-])/,
    inside: {
      identifier: /\s(.*)\s/
    },
    lookbehind: true
  },
  // call: {
  //   pattern: /(\()([\w|.|-]+.*?\b)/,
  //   lookbehind: true
  // },
  constant: /\b(?:t|T|NIL|nil|&optional)\b/,
  number: /\b[\d]+\b/i,
  special: /\$|\?/i,
  punctuation: /[{}[\](),]/
}
