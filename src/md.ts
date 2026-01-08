export class MDInlineGrammarRule {
  matcher: [RegExp, any] = [new RegExp(''), '']
  childrenInlineRules: MDInlineGrammarRule[] = []
}

export class MDLineGrammarRule {
  matcher: [RegExp, any] = [new RegExp(''), '']
  preProccessing?: (v: string) => string
  postProccessing?: (v: string) => string
  childrenInlineRules: MDInlineGrammarRule[] = []
}

export class GlobalGrammarRule {
  postProccessing?: (v: string) => string
  childrenMultilineRules: MDMultilineGrammarRule[] = []
  childrenLineRules: MDLineGrammarRule[] = []
  childrenInlineRules: MDInlineGrammarRule[] = []
}

export class MDMultilineGrammarRule {
  startMatcher: [RegExp, any] = [new RegExp(''), '']
  endMatcher: [RegExp, any] = [new RegExp(''), '']
  postProccessing?: (v: string) => string
  childrenMultilineRules: MDMultilineGrammarRule[] = []
  childrenLineRules: MDLineGrammarRule[] = []
  childrenInlineRules: MDInlineGrammarRule[] = []
}

export class MDGrammar {
  readonly globalRule: GlobalGrammarRule

  readonly sup: MDInlineGrammarRule
  readonly sub: MDInlineGrammarRule
  readonly strong: MDInlineGrammarRule
  readonly bold: MDInlineGrammarRule
  readonly italic: MDInlineGrammarRule
  readonly boldItalic: MDInlineGrammarRule
  readonly em: MDInlineGrammarRule
  readonly code: MDInlineGrammarRule
  readonly icon: MDInlineGrammarRule
  readonly figure: MDInlineGrammarRule
  readonly img: MDInlineGrammarRule
  readonly link: MDInlineGrammarRule

  readonly header: MDLineGrammarRule
  readonly quote: MDLineGrammarRule
  readonly footer: MDLineGrammarRule
  readonly alignRight: MDLineGrammarRule
  readonly tilde: MDLineGrammarRule
  readonly alignCenter: MDLineGrammarRule
  readonly horRule: MDLineGrammarRule
  readonly stars: MDLineGrammarRule
  readonly p: MDLineGrammarRule
  readonly br: MDLineGrammarRule
  readonly oli: MDLineGrammarRule
  readonly uli: MDLineGrammarRule
  readonly audio: MDLineGrammarRule
  readonly video: MDLineGrammarRule

  readonly quoteMultiline: MDMultilineGrammarRule
  readonly ol: MDMultilineGrammarRule
  readonly ul: MDMultilineGrammarRule
  readonly table: MDMultilineGrammarRule
  readonly div: MDMultilineGrammarRule

  constructor() {
    this.globalRule = new GlobalGrammarRule()
    const defLinePreproccessing = (v: string): string => {
      let res = v
      res = res.replace(/</g, '&lt;')
      //character escaping
      res = res.replace(/\\`/gm, '&#x60;')
      res = res.replace(/\\#/gm, '&#x23;')
      res = res.replace(/\\_/g, '&#x5f;')
      return res
    }

    // 
    // INLINE GRAMMAR RULES
    //

    this.sup = new MDInlineGrammarRule()
    this.sup.matcher = [/\^\{([^}]+)\}/g, '<sup>$1</sup>']

    this.sub = new MDInlineGrammarRule()
    this.sub.matcher = [/_\{([^}]+)\}/g, '<sub>$1</sub>']

    this.strong = new MDInlineGrammarRule()
    this.strong.matcher = [/\*([^*]+)\*/g, '<strong>$1</strong>']

    this.boldItalic = new MDInlineGrammarRule()
    this.boldItalic.matcher = [/_{3,}([^_]+)_{3,}/g, '<b><i>$1</i></b>']

    this.bold = new MDInlineGrammarRule()
    this.bold.matcher = [/_{2,}([^_]+)_{2,}/g, '<b>$1</b>']

    this.italic = new MDInlineGrammarRule()
    this.italic.matcher = [/_([^_]+)_/g, '<i>$1</i>']

    this.em = new MDInlineGrammarRule()
    this.em.matcher = [/`([^`]+)`/g, '<em>$1</em>']
    this.em.childrenInlineRules = [this.strong, this.boldItalic, this.bold, this.italic]

    this.code = new MDInlineGrammarRule()
    this.code.matcher = [/``([^`]+)``/g, '<code>$1</code>']

    this.icon = new MDInlineGrammarRule()
    this.icon.matcher = [/\[icon:([^\]]+)\]/g, '<span class="md-icon">$1</span>']

    this.figure = new MDInlineGrammarRule()
    this.figure.matcher = [/\[img:([^, ]+), ?([^\]]+)\]/g, '<figure><img src="$1"/><figcaption>$2</figcaption></figure>']

    this.img = new MDInlineGrammarRule()
    this.img.matcher = [/\[img:([^\]]+)\]/g, '<img src="$1"/>']

    this.link = new MDInlineGrammarRule()
    this.link.matcher = [/\[link:([^, \]]+),? *([^\]]*)\]/g, (line: string, url: string, descr: string) => {
      return '<a href="' + url + '">' + (descr || url) + '</a>'
    }]

    this.globalRule.childrenInlineRules = [this.code, this.figure, this.img, this.link, this.icon, this.sub, this.sup, this.strong, this.boldItalic, this.bold, this.em, this.italic]

    // 
    // LINE GRAMMAR RULES
    //

    this.header = new MDLineGrammarRule()
    this.header.matcher = [/^(#{1,6}) (.*)$/, (line: string, signs: string, header: string) => {
      const count = signs.length
      return '<h' + count + '>' + header + '</h' + count + '>'
    }]
    this.header.childrenInlineRules = [this.strong, this.boldItalic, this.bold, this.italic, this.icon]
    this.header.preProccessing = defLinePreproccessing

    this.quote = new MDLineGrammarRule()
    this.quote.matcher = [/^> (.*)$/, '<blockquote><p>$1</p></blockquote>']
    this.quote.childrenInlineRules = this.globalRule.childrenInlineRules
    this.quote.preProccessing = defLinePreproccessing

    this.footer = new MDLineGrammarRule()
    this.footer.matcher = [/^@ *(.*) *$/, '<footer>$1</footer>']
    this.footer.childrenInlineRules = this.globalRule.childrenInlineRules
    this.footer.preProccessing = defLinePreproccessing

    this.tilde = new MDLineGrammarRule()
    this.tilde.matcher = [/^~ (.*)$/, '<p><strong>$1</strong></p>']
    this.tilde.childrenInlineRules = this.globalRule.childrenInlineRules
    this.tilde.preProccessing = defLinePreproccessing

    this.alignRight = new MDLineGrammarRule()
    this.alignRight.matcher = [/^==> (.*)$/, '<p class="md-right">$1</p>']
    this.alignRight.childrenInlineRules = this.globalRule.childrenInlineRules
    this.alignRight.preProccessing = defLinePreproccessing

    this.alignCenter = new MDLineGrammarRule()
    this.alignCenter.matcher = [/^=> (.*)$/, '<p class="md-center">$1</p>']
    this.alignCenter.childrenInlineRules = this.globalRule.childrenInlineRules
    this.alignCenter.preProccessing = defLinePreproccessing

    this.br = new MDLineGrammarRule()
    this.br.matcher = [/^\n$/, '<br/>']

    this.oli = new MDLineGrammarRule()
    this.oli.matcher = [/^\d+\. (.*)$/, '<li>$1</li>']
    this.oli.childrenInlineRules = this.globalRule.childrenInlineRules
    this.oli.preProccessing = defLinePreproccessing

    this.uli = new MDLineGrammarRule()
    this.uli.matcher = [/^\+ (.*)$/, '<li>$1</li>']
    this.uli.childrenInlineRules = this.globalRule.childrenInlineRules
    this.uli.preProccessing = defLinePreproccessing

    this.audio = new MDLineGrammarRule()
    this.audio.matcher = [/\[audio:([^\]]+)\]/, '<audio controls src="$1"></audio>']

    this.video = new MDLineGrammarRule()
    const videoReplacer = (_: string, url: string, params: string) => {
      const keyValues = params ? params.split(/, */) : []
      let res = '<video src="' + url + '"'
      keyValues.forEach(kv => res += kv.replace(/^ *([^:]+):?(.*)$/, (_: string, key: string, value: string) => value ? ` ${key}="${value}"` : ` ${key}`))
      res += '></video>'
      return res
    }
    this.video.matcher = [/^\[video:([^, \]]+),? *([^\]]*)\]/, videoReplacer]

    this.horRule = new MDLineGrammarRule()
    this.horRule.matcher = [/^---$/, '<hr/>']

    this.stars = new MDLineGrammarRule()
    this.stars.matcher = [/^(\*{3,})/, '<p class="md-delim">$1</p>']

    this.p = new MDLineGrammarRule()
    this.p.matcher = [/^(.*)$/, '<p>$1</p>']
    this.p.childrenInlineRules = this.globalRule.childrenInlineRules
    this.p.preProccessing = defLinePreproccessing

    this.globalRule.childrenLineRules = [this.header, this.tilde, this.quote, this.alignCenter, this.alignRight, this.footer, this.audio, this.video, this.horRule, this.stars, this.br, this.p]

    //
    // MULTILINE GRAMMAR RULES
    //

    
    this.quoteMultiline = new MDMultilineGrammarRule()
    this.quoteMultiline.startMatcher = [/^>> *$/, '<blockquote>']
    this.quoteMultiline.endMatcher = [/^<< *$/, '</blockquote>']
    this.quoteMultiline.childrenInlineRules = this.globalRule.childrenInlineRules
    this.quoteMultiline.childrenLineRules = [this.footer, this.alignCenter, this.alignRight, this.tilde, this.horRule, this.br, this.p]

    this.ol = new MDMultilineGrammarRule()
    this.ul = new MDMultilineGrammarRule()
    this.ol.startMatcher = [/^```ol *$/, '<ol>']
    this.ol.endMatcher = [/^``` *$/, '</ol>']
    this.ol.childrenInlineRules = this.globalRule.childrenInlineRules
    this.ol.childrenLineRules = [this.oli, this.tilde, this.br, this.p]
    this.ol.childrenMultilineRules = [this.ol, this.ul]

    this.ul.startMatcher = [/^```ul *$/, '<ul>']
    this.ul.endMatcher = [/^``` *$/, '</ul>']
    this.ul.childrenInlineRules = this.globalRule.childrenInlineRules
    this.ul.childrenLineRules = [this.uli, this.tilde, this.br, this.p]
    this.ul.childrenMultilineRules = [this.ol, this.ul]

    this.table = new MDMultilineGrammarRule()
    this.table.startMatcher = [/^```tbl *$/, '<table>']
    this.table.endMatcher = [/^``` *$/, '</table>']
    const tableRow = new MDLineGrammarRule()
    tableRow.matcher = [/^(.*)$/, (line: string) => {
      return '<tr>' + line.split(/,(?! )/).map(v => '<td>' + v + '</td>').join('') + '</tr>'
    }]
    tableRow.childrenInlineRules = this.globalRule.childrenInlineRules
    tableRow.preProccessing = defLinePreproccessing
    this.table.childrenLineRules = [tableRow]

    this.div = new MDMultilineGrammarRule()
    this.div.startMatcher = [/^```([a-zA-Z]+) */, '<div class="$1"><div>']
    this.div.endMatcher = [/^``` *$/, '</div></div>']
    this.div.childrenInlineRules = this.globalRule.childrenInlineRules
    this.div.childrenLineRules = [this.quote, this.tilde, this.alignCenter, this.alignRight, this.footer, this.horRule, this.br, this.p]
    this.div.childrenMultilineRules = [this.ol, this.ul, this.table, this.quoteMultiline, this.div]

    this.globalRule.childrenMultilineRules = [this.ol, this.ul, this.table, this.quoteMultiline, this.div]
  }
}

class MDParserContext {
  readonly rows: string[]

  constructor(text: string) {
    this.rows = text.split('\n')
  }

  private _rowIndex: number = -1

  nextRow(): string | undefined {
    this._rowIndex++
    return this._rowIndex < this.rows.length ? this.rows[this._rowIndex] : undefined
  }
}

export class MDParser {
  readonly globalRule: GlobalGrammarRule
  constructor(grammar: MDGrammar) {
    this.globalRule = grammar.globalRule
  }

  run(text: string): string {
    const ctx = new MDParserContext(text)
    return this.parseMultiline(ctx, this.globalRule)
  }

  private parseMultiline(ctx: MDParserContext, rule: MDMultilineGrammarRule | GlobalGrammarRule): string {
    let res = ''
    let exactlyMatched = false
    while (true) {
      let row = ctx.nextRow()
      if (row === undefined) break
      if (!row) row = '\n'

      exactlyMatched = false

      if (!(rule instanceof GlobalGrammarRule) && row.match(rule.endMatcher[0])) {
        res += row.replace(rule.endMatcher[0], rule.endMatcher[1])
        break
      }

      for (let i = 0; i < rule.childrenMultilineRules.length; i++) {
        const r = rule.childrenMultilineRules[i]
        if (row.match(r.startMatcher[0])) {
          exactlyMatched = true
          res += row.replace(r.startMatcher[0], r.startMatcher[1])
          res += this.parseMultiline(ctx, r)
          break
        }
      }

      if (exactlyMatched) continue

      for (let i = 0; i < rule.childrenLineRules.length; i++) {
        const r = rule.childrenLineRules[i]
        if (row.match(r.matcher[0])) {
          exactlyMatched = true
          let line = r.preProccessing ? r.preProccessing(row) : row
          line = line.replace(r.matcher[0], r.matcher[1])
          line = this.parseLine(line, r.childrenInlineRules)
          if (r.postProccessing) line = r.postProccessing(line)

          res += line
          break
        }
      }

      if (exactlyMatched) continue

      console.warn('Line is not handled by any rule, line: <', row, '>', 'parent rule:', rule)
      res += this.parseLine(row, rule.childrenInlineRules)
    }

    if (rule.postProccessing) res = rule.postProccessing(res)
    return res
  }

  private parseLine(text: string, inlineRules: MDInlineGrammarRule[]): string {
    if (!text || inlineRules.length === 0) return text
    if (inlineRules.length === 1) {
      return text.replace(inlineRules[0].matcher[0], inlineRules[0].matcher[1])
    }

    const buffer: string[] = []
    let rules = [...inlineRules]
    let value = text

    while (value) {
      const candidateRules = []
      let matchedRule: MDInlineGrammarRule | undefined
      let matchedRuleMinSearchIndex = value.length
      for (let i = 0; i < rules.length; i++) {
        const r = rules[i]
        const si = value.search(r.matcher[0])
        if (si !== -1) {
          candidateRules.push(r)
          if (si < matchedRuleMinSearchIndex) {
            matchedRuleMinSearchIndex = si
            matchedRule = r
          }
        }
      }

      if (!matchedRule) {
        buffer.push(value)
        break
      }

      buffer.push(value.substring(0, matchedRuleMinSearchIndex))
      value = value.substring(matchedRuleMinSearchIndex)

      let replacingSubstring = value.match(matchedRule.matcher[0])?.[0] ?? ''
      value = value.substring(replacingSubstring.length)

      replacingSubstring = replacingSubstring.replace(matchedRule.matcher[0], matchedRule.matcher[1])
      if (matchedRule.childrenInlineRules.length > 0)
        replacingSubstring = this.parseLine(replacingSubstring, matchedRule.childrenInlineRules)

      buffer.push(replacingSubstring)
      rules = candidateRules
    }

    return buffer.join('')
  }
}

// const parser = new MDParser(new MDGrammar)
export const md = (parser: MDParser, text: string, absolutePathPrefix?: string, mark?: string) => {
  let res = parser.run(text)
  // allow images and links to have a relative path
  if (absolutePathPrefix)
    res = res.replace(/src="((?!https?:)[^"]+)"/gm, 'src="' + absolutePathPrefix + '$1"')

  if (mark)
    res = res.replace(new RegExp('(' + escapeRegExp(mark) + ')', 'gi'), '<mark>$1</mark>')
  
  return res
}

const escapeRegExp = (value: string) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}