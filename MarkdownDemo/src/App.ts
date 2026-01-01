import { RXObservableValue } from "flinker";
import { btn, h1, h2, hstack, p, textarea, vstack } from "flinker-dom";
import { Markdown } from "./Markdown";
import alignmentContent from "./resources/alignment.txt?raw";
import audioContent from "./resources/audio.txt?raw";
import formattingContent from "./resources/formatting.txt?raw";
import headersContent from "./resources/headers.txt?raw";
import imageContent from "./resources/image.txt?raw";
import linksContent from "./resources/links.txt?raw";
import listsContent from "./resources/lists.txt?raw";
import quoteContent from "./resources/quote.txt?raw";
import supsubContent from "./resources/supsub.txt?raw";
import tableContent from "./resources/table.txt?raw";
import videoContent from "./resources/video.txt?raw";
import iconsContent from "./resources/icons.txt?raw";
import customizationContent from "./resources/customization.txt?raw";

export function App() {
  const headerColor = '#248057'
  return vstack()
    .react(s => {
      s.width = '100%'
      s.padding = '20px'
      s.gap = '0px'
    })
    .children(() => {

      h1()
        .react(s => {
          s.width = '100%'
          s.text = 'Flinker Markdown'
          s.textColor = headerColor
        })

      p()
        .react(s => {
          s.width = '100%'
          s.text = 'TypeScript library for parsing markdown text into html'
          s.textColor = headerColor
        })

      Example('Headers', headersContent)
      Example('Ordered/unordered list (ol/ul)', listsContent)
      Example('Formatting', formattingContent)
      Example('Superscripts and subscripts', supsubContent)
      Example('Blockquote', quoteContent)
      Example('Alignment', alignmentContent)
      Example('Table', tableContent)
      Example('Links', linksContent)
      Example('Image', imageContent)
      Example('Audio', audioContent)
      Example('Video', videoContent)
      Example('Icons', iconsContent)
      Example('Customization', customizationContent)
    })
}

type Mode = 'md' | 'css'
const Example = (title: string, text: string) => {
  const values = text.split('[css]')
  const $state = new RXObservableValue(values.length > 0 ? values[0].trim() : '')
  const $mode = new RXObservableValue<Mode>('md')
  const css = values.length > 1 ? values[1].trim() : ''

  return vstack()
    .react(s => {
      s.paddingTop = '50px'
      s.valign = 'top'
    })
    .children(() => {
      h2()
        .react(s => {
          s.width = '100%'
          s.text = title
          s.textColor = '#2a6579'
        })

      stack()
        .react(s => {
          s.width = '100%'
          s.gap = '20px'
        })
        .children(() => {
          textarea()
            .bind($state)
            .react(s => {
              s.type = 'text'
              s.width = '100%'
              s.padding = '10px'
              s.autoCorrect = 'off'
              s.autoComplete = 'off'
              s.autoResize = true
            })

          vstack()
            .observe($mode, 'recreateChildren')
            .react(s => {
              s.width = '100%'
              s.gap = '10px'
            })
            .children(() => {
              css && ModeBtnBar($mode)

              $mode.value === 'md' && Markdown()
                .observe($state.pipe().debounce(1000).fork())
                .react(s => {
                  s.mode = 'md'
                  s.width = '100%'
                  s.text = $state.value
                })

              $mode.value === 'css' && p()
                .react(s => {
                  s.className = 'code'
                  s.width = '100%'
                  s.text = css
                })
            })
        })
    })
}

const stack = () => {
  const isMobileDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0)
  return isMobileDevice ? vstack() : hstack()
}

const ModeBtnBar = ($mode: RXObservableValue<Mode>) => {
  return hstack()
    .observe($mode, 'affectsChildrenProps')
    .react(s => {
      s.gap = '10px'
      s.width = '100%'
      s.halign = 'center'
    })
    .children(() => {

      Btn()
        .react(s => {
          s.text = 'md'
          s.isSelected = $mode.value === 'md'
        })
        .onClick(() => $mode.value = 'md')

      Btn()
        .react(s => {
          s.text = 'css'
          s.isSelected = $mode.value === 'css'
        })
        .onClick(() => $mode.value = 'css')
    })
}

const Btn = () => {
  const color = '#24adba'
  return btn()
    .react(s => {
      s.className = 'mono'
      s.fontSize = '0.9rem'
      s.paddingHorizontal = '20px'
      s.gap = '2px'
      s.textColor = color + 'bb'
      s.cornerRadius = '2px'
    })
    .whenHovered(s => {
      s.textColor = color
    })
    .whenSelected(s => {
      s.bgColor = color
      s.textColor = '#111111'
    })
}