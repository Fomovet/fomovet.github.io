import { createHighlighter } from 'shiki'
import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join } from 'path'

const LANGS = [
  'javascript', 'typescript', 'python', 'java', 'kotlin', 'scala',
  'bash', 'shell', 'zsh', 'powershell', 'css', 'scss', 'html', 'xml',
  'json', 'yaml', 'toml', 'markdown', 'go', 'rust', 'c', 'cpp',
  'sql', 'dockerfile', 'nginx', 'ruby', 'php', 'swift', 'diff', 'ini'
]

const hl = await createHighlighter({
  themes: ['github-light', 'github-dark'],
  langs: LANGS
})

function decode(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
}

function stripTags(html) {
  return html.replace(/<[^>]+>/g, '')
}

function processHtml(content) {
  let changed = false
  const result = content.replace(
    /<code class="language-(\w+)">([\s\S]*?)<\/code>/g,
    (match, lang, inner) => {
      if (!LANGS.includes(lang)) return match
      const code = decode(stripTags(inner)).replace(/\n$/, '')
      if (!code.trim()) return match
      try {
        const html = hl.codeToHtml(code, {
          lang,
          themes: { light: 'github-light', dark: 'github-dark' }
        })
        const m = html.match(/<code[^>]*>([\s\S]*?)<\/code>/)
        if (!m) return match
        changed = true
        return `<code class="language-${lang}">${m[1]}</code>`
      } catch {
        return match
      }
    }
  )
  return changed ? result : null
}

function* walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) yield* walk(p)
    else if (e.name.endsWith('.html')) yield p
  }
}

let count = 0
for (const file of walk('_site')) {
  const content = readFileSync(file, 'utf-8')
  const result = processHtml(content)
  if (result) {
    writeFileSync(file, result, 'utf-8')
    count++
  }
}
console.log(`✓ Shiki: highlighted ${count} files`)
