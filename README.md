## Intro
__FlinkerMD__ (MD) is a TypeScript library for parsing markdown text into html.


## Install
```cli
npm i flinker-markdown
```

## Example
```ts
import { md, MDGrammar, MDParser } from "flinker-markdown"
import { div, TextProps } from "flinker-dom"

interface MarkdownProps extends TextProps {
  absolutePathPrefix?: string
  showRawText?: boolean
}

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

## License
MIT