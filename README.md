## Intro
__FlinkerMD__ (MD) is a TypeScript library for parsing markdown text into html.


## Install
```cli
npm i flinker-markdown
```

## Example 1
```ts
import { md, MDGrammar, MDParser } from "flinker-markdown"
import { div, TextProps } from "flinker-dom"

interface MarkdownProps extends TextProps {
  absolutePathPrefix?: string
  showRawText?: boolean
}

const grammar = new MDGrammar()
const parser = new MDParser(grammar)
export const Markdown = () => {
  return div<MarkdownProps>()
    .map(s => {
      if (!s.showRawText) {
        s.htmlText = s.text ? md(parser, s.text, s.absolutePathPrefix) : ''
        s.text = ''
      }
    })
}
```

## Example 2: Custom grammar rule
Parsing Bash code:
```ts
const grammar = new MDGrammar()
const bash = new MDLineGrammarRule()
bash.matcher = [/^>>> /, '> '] // begin text with symbols >>> to tranform line to bash code
bash.postProccessing = highlightBashCode // define highlight-func: (v: string) => string
grammar.globalRule.childrenLineRules.splice(0, 0, bash)
grammar.ol.childrenLineRules.splice(0, 0, bash) // allow lists to include bash code
grammar.ul.childrenLineRules.splice(0, 0, bash)

const parser = new MDParser(grammar)
export const Markdown = () => {...}
```

highlightBashCode-func transforms text from e.g.:
```html
>>> npm run install
```
to the tokenized form: 
```html
<pre class="bashcode-dark"><code class="md-dark"><span class="op">&gt; </span><span class="bash-cmd">npm </span><span class="bash-param">run </span><span class="bash-param">install</span></code></pre>
```

## License
MIT