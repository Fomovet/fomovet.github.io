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
  // Rouge structure: <div class="language-LANG highlighter-rouge"><div class="highlight"><pre class="highlight"><code>...</code></pre></div></div>
  const result = content.replace(
    /<div class="language-(\w+) highlighter-rouge">\s*<div class="highlight">\s*<pre class="highlight">\s*<code>([\s\S]*?)<\/code>\s*<\/pre>\s*<\/div>\s*<\/div>/g,
    (match, lang, inner) => {
      if (!LANGS.includes(lang)) return match
      const code = decode(stripTags(inner)).replace(/\n$/, '')
      if (!code.trim()) return match
      try {
        const shikiHtml = hl.codeToHtml(code, {
          lang,
          themes: { light: 'github-light', dark: 'github-dark' }
        })
        changed = true
        // 保留外层 .highlight 包装，供 ext-code.html 的复制按钮使用
        return `<div class="language-${lang} highlighter-rouge"><div class="highlight">${shikiHtml}</div></div>`
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
