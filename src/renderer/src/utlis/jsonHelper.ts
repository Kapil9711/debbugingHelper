export function clearExistingHighlights(root: Element) {
  const marks = root.querySelectorAll('mark.json-highlight')
  marks.forEach((mark) => {
    const parent = mark.parentNode
    if (!parent) return
    // replace <mark> with its text
    parent.replaceChild(document.createTextNode(mark.textContent || ''), mark)
    parent.normalize() // merge adjacent text nodes
  })
}

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function highlightMatches(root: Element, query: string) {
  if (!query) return
  const regex = new RegExp(escapeRegex(query), 'gi')

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null)

  const textNodes: Text[] = []
  let current = walker.nextNode()
  while (current) {
    textNodes.push(current as Text)
    current = walker.nextNode()
  }

  textNodes.forEach((textNode) => {
    const text = textNode.nodeValue || ''
    if (!regex.test(text)) {
      regex.lastIndex = 0
      return
    }

    const frag = document.createDocumentFragment()
    let lastIndex = 0
    regex.lastIndex = 0

    let match: RegExpExecArray | null
    while ((match = regex.exec(text)) !== null) {
      const start = match.index
      const end = start + match[0].length

      if (start > lastIndex) {
        frag.appendChild(document.createTextNode(text.slice(lastIndex, start)))
      }

      const mark = document.createElement('mark')
      mark.className = 'json-highlight'
      mark.textContent = text.slice(start, end)
      frag.appendChild(mark)

      lastIndex = end
    }

    if (lastIndex < text.length) {
      frag.appendChild(document.createTextNode(text.slice(lastIndex)))
    }

    const parent = textNode.parentNode
    if (!parent) return
    parent.replaceChild(frag, textNode)
  })
}
