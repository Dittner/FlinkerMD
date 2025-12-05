## Intro
__FlinkerMD__ (MD) is a TypeScript library for parsing markdown text into html.


## Install
```cli
npm i flinker-markdown
```

## Demo
```cli
git clone https://github.com/Dittner/FlinkerMD
cd FlinkerMD/MarkdownDemo
npm install
npm run dev
```

## Example 1
```ts
import { div, TextProps } from "flinker-dom"
import { md, MDGrammar, MDParser } from "flinker-markdown"

interface MarkdownProps extends TextProps {
  absolutePathPrefix?: string
  mode: 'md' | 'rawText' | 'rawHtml'
}

const parser = new MDParser(new MDGrammar())
export const Markdown = () => {
  return div<MarkdownProps>()
    .map(s => {
      if (s.mode === 'md') {
        s.htmlText = s.text ? md(parser, s.text, s.absolutePathPrefix) : ''
        s.text = ''
      } else if (s.mode === 'rawHtml') {
        s.text = s.text ? md(parser, s.text, s.absolutePathPrefix) : ''
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