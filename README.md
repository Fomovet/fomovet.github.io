# Fomovet Blog

基于 [TMaize Blog](https://github.com/TMaize/tmaize-blog) 主题二次开发的个人博客，使用 Jekyll 构建，自动部署到 GitHub Pages。

## 特性

- **零框架**：未引入任何 CSS/JS 框架，页面资源极小，秒开
- **自动部署**：push 到 master 分支后，GitHub Actions 自动构建并发布
- **深色/浅色模式**：手动切换，状态本地持久化
- **文章大纲（TOC）**：文章页左侧固定显示，滚动自动高亮当前章节，DOMContentLoaded 后立即渲染
- **代码高亮**：使用 Shiki（VS Code 同款引擎）在构建阶段完成，支持 github-light / github-dark 双主题，浏览器无需加载任何 JS 即可显示颜色
- **代码复制**：代码块右上角悬停显示语言标签和复制按钮，2 秒后自动重置
- **评论系统**：集成 Giscus（基于 GitHub Discussions），深色模式自动同步
- **导航图标**：菜单项内联 SVG 图标，零外部依赖，深色模式自动切换颜色
- **系统字体**：使用 Segoe UI / -apple-system / system-ui 字体栈，无需加载字体文件
- **响应式**：适配桌面和移动端
- **全文搜索**：内置静态搜索，无需后端
- **图片预览**：点击文章内图片全屏预览

## 目录结构

```
├── _posts/          # 文章（命名格式：yyyy-MM-dd-title.md）
├── posts/           # 文章资源（图片等，按 yyyy/MM/dd 存放）
├── pages/           # 独立页面
├── _includes/       # 可复用模板片段
├── _layouts/        # 页面布局
├── static/          # 静态资源（CSS/JS/图片）
├── scripts/         # 构建脚本（Shiki 代码高亮）
├── _config.yml      # 站点配置
└── package.json     # Node.js 依赖（仅 Shiki）
```

## 写文章

在 `_posts/` 目录下新建文件，命名格式为 `yyyy-MM-dd-title.md`：

```yaml
---
layout: mypost
title: 文章标题
categories: [分类1, 分类2]
---

文章内容，Markdown 格式。

代码块需指定语言以获得语法高亮：

```python
print("hello world")
```
```

文章内的图片等资源放在 `posts/yyyy/MM/dd/` 目录下，在 Markdown 中直接引用文件名即可。

## 配置说明

编辑 `_config.yml`：

| 配置项 | 说明 |
|---|---|
| `title` | 站点标题 |
| `description` | 站点描述 |
| `author` | 作者名 |
| `footerText` | 页脚文字 |
| `domainUrl` | 站点域名 |
| `extToc` | 是否开启文章大纲（true/false） |
| `extComment` | 是否开启 Giscus 评论（true/false） |
| `extCode` | 是否开启代码复制按钮（true/false） |
| `extMath` | 是否开启数学公式（true/false） |

## Logo 和 Favicon

替换 `static/img/logo.png`（左上角头像）和 `static/img/favicon.png`（浏览器标签图标），建议使用正方形图片。

## 本地预览

需要安装 Ruby 环境：

```bash
gem install bundler
bundle install
bundle exec jekyll serve --watch --host=127.0.0.1 --port=8080
```

## 评论配置（Giscus）

1. 开启仓库的 GitHub Discussions 功能
2. 安装 [Giscus App](https://github.com/apps/giscus)
3. 在 [giscus.app](https://giscus.app) 生成配置，填入 `_includes/ext-comment.html`
4. 将 `_config.yml` 中 `extComment` 设为 `true`
