import { div, TextProps } from "flinker-dom"
import { md, MDGrammar, MDParser } from "flinker-markdown"

interface MarkdownProps extends TextProps {
  absolutePathPrefix?: string
  mode: 'md' | 'rawText' | 'rawHtml'
}

// CUSTOM GRAMMAR RULES
const grammar = new MDGrammar()
// const figureCaption = new MDInlineGrammarRule()
// figureCaption.matcher = [/\[cap:([^\]]+)\]/g, '<span class="md-caption">$1</span>']
// grammar.globalRule.childrenInlineRules.unshift(figureCaption)

const parser = new MDParser(grammar)
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