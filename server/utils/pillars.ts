/**
 * Problem pillar / cluster content, extracted from the published Oxygen pages
 * on legendseor.com. The pages are design-built (not post content), so the
 * REST API can't serve them — we extract the rendered article body instead:
 * everything inside ct-inner-content from the first <h2> up to the FAQ
 * section, plus the FAQ pairs themselves.
 */

const WP = process.env.WP_BASE_URL || process.env.GF_BASE_URL || 'https://legendseor.com'

export const PILLAR_URLS: Record<string, string> = {
  'true-cost-of-an-employee-in-the-uk': `${WP}/true-cost-of-an-employee-uk/`,
  'permanent-establishment-guide': `${WP}/permanent-establishment/`,
  'employee-on-costs': `${WP}/cost-of-employing-someone-uk/`,
  // pillar 2's cluster is not published on WP yet — add its URL here when live
}

function stripText(s: string) {
  return (s || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&#8217;|&rsquo;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&#8211;/g, '–')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractFaqs(html: string): { q: string; a: string }[] {
  const faqs: { q: string; a: string }[] = []
  const re = /<h4 class="oxy-pro-accordion_title">([\s\S]*?)<\/h4>[\s\S]*?<div id="body-[^"]*" class="oxy-pro-accordion_body"[^>]*>([\s\S]*?)<\/div>/g
  let m: RegExpExecArray | null
  while ((m = re.exec(html)) !== null) {
    const q = stripText(m[1]!)
    const a = stripText(m[2]!)
    if (q && a) faqs.push({ q, a })
  }
  return faqs
}

const VOID_TAGS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr'])

/**
 * The body is a slice of a larger document, so it starts/ends mid-tree.
 * Drop closing tags with no matching opener and close any left open —
 * otherwise the browser re-balances the DOM differently from the SSR string
 * and Vue reports a hydration mismatch.
 */
function balanceHtml(html: string): string {
  const stack: string[] = []
  const drops: [number, number][] = []
  const re = /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)((?:"[^"]*"|'[^']*'|[^'">])*)>/g
  let m: RegExpExecArray | null
  while ((m = re.exec(html)) !== null) {
    const [full, close, rawTag, attrs] = m
    const tag = rawTag!.toLowerCase()
    if (VOID_TAGS.has(tag) || attrs?.endsWith('/')) continue
    if (!close) {
      stack.push(tag)
    } else if (stack.length && stack[stack.length - 1] === tag) {
      stack.pop()
    } else {
      const idx = stack.lastIndexOf(tag)
      if (idx >= 0) stack.splice(idx) // implicitly closes inner tags
      else drops.push([m.index, m.index + full.length]) // orphan closer
    }
  }
  for (const [s, e] of drops.reverse()) html = html.slice(0, s) + html.slice(e)
  while (stack.length) html += `</${stack.pop()}>`
  return html
}

export async function fetchPillarBody(slug: string) {
  const url = PILLAR_URLS[slug]
  if (!url) return null

  const res = await fetch(url)
  if (!res.ok) return null
  let html = await res.text()

  // page h1 (real display title; the WP post title may be a placeholder)
  const h1 = stripText((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1] || '')

  // isolate the Oxygen inner content
  const innerIdx = html.indexOf('ct-inner-content')
  if (innerIdx > 0) html = html.slice(innerIdx)

  // FAQs (rendered separately in our own accordion)
  const faqs = extractFaqs(html)

  // strip scripts/styles/noscript
  html = html
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<noscript[\s\S]*?<\/noscript>/g, '')

  // body: from the first <h2> (after the hero) to just before the FAQ / final form
  const start = html.indexOf('<h2')
  if (start > 0) html = html.slice(start)
  for (const marker of ['Frequently asked questions', 'Plan against the true number', 'Ready to cut hiring costs']) {
    const i = html.indexOf(marker)
    if (i > 0) {
      const cut = html.lastIndexOf('<div', i)
      html = html.slice(0, cut > 0 ? cut : i)
      break
    }
  }

  // Oxygen numbered-row layout: the row number sits in its own nested div
  // (div > div > text-block). Collapse it to a span so it can be styled as a
  // number chip beside the text instead of a bare digit on its own line.
  html = html.replace(
    /<div id="div_block-[^"]*" class="ct-div-block" ><div id="div_block-[^"]*" class="ct-div-block" ><div id="text_block-[^"]*" class="ct-text-block" >(\d{1,2})<\/div><\/div><\/div>/g,
    '<span class="pi-num">$1</span>',
  )
  // Second Oxygen variant ("cost stack" cards): <b>01</b> in a bare text block,
  // followed by sibling title + description blocks.
  html = html.replace(
    /<div id="text_block-[^"]*" class="ct-text-block" ><b>(\d{1,2})<\/b><\/div>/g,
    '<span class="pi-num pi-num--card">$1</span>',
  )
  // Third variant: section headings prefixed with a number block — becomes the
  // green square badge next to the h2 (matches the WP design).
  html = html.replace(
    /<div id="div_block-[^"]*" class="ct-div-block" ><div id="text_block-[^"]*" class="ct-text-block" >(\d{1,2})<\/div><\/div>(<div id="div_block-[^"]*" class="ct-div-block" ><h2)/g,
    '<span class="pi-h2-badge">$1</span>$2',
  )

  return { title: h1, bodyHtml: balanceHtml(html), faqs }
}
