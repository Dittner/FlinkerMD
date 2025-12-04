import { RXObservableValue } from "flinker";
import { h1, h2, hstack, p, textarea, vstack } from "flinker-dom";
import { Markdown } from "./Markdown";
import alignmentContent from "./resources/alignment.txt?raw";
import audioContent from "./resources/audio.txt?raw";
import formatingContent from "./resources/formating.txt?raw";
import headersContent from "./resources/headers.txt?raw";
import imageContent from "./resources/image.txt?raw";
import linksContent from "./resources/links.txt?raw";
import listsContent from "./resources/lists.txt?raw";
import quoteContent from "./resources/quote.txt?raw";
import supsubContent from "./resources/supsub.txt?raw";
import tableContent from "./resources/table.txt?raw";
import videoContent from "./resources/video.txt?raw";
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
      Example('Formating', formatingContent)
      Example('Superscripts and subscripts', supsubContent)
      Example('Blockquote', quoteContent)
      Example('Alignment', alignmentContent)
      Example('Table', tableContent)
      Example('Links', linksContent)
      Example('Image', imageContent)
      Example('Audio', audioContent)
      Example('Video', videoContent)
      Example('Customization', customizationContent)

    })
}

export function Example(title: string, text: string) {
  const $state = new RXObservableValue(text)

  return vstack()
    .react(s => {
      s.paddingTop = '50px'
    })
    .children(() => {
      h2()
        .react(s => {
          s.width = '100%'
          s.text = title
          s.textColor = '#2a6579'
        })

      hstack()
        .react(s => {
          s.width = '100%'
          s.gap = '20px'
        })
        .children(() => {
          textarea()
            .bind($state)
            .react(s => {
              s.type = 'text'
              s.width = '50%'
              s.padding = '10px'
              s.autoCorrect = 'off'
              s.autoComplete = 'off'
              s.autoResize = true
            })

          Markdown()
            .observe($state.pipe().debounce(1000).fork())
            .react(s => {
              s.width = '50%'
              s.text = $state.value
            })
        })
    })
}