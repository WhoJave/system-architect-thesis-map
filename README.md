# 架构师学习地图

纯静态学习站：论文方法、消费金融项目底座、八大主题、万能模板、交互记忆、大数据、测试与云原生。主页仅展示导航，各主题独立阅读。

## 新增学习页面

1. 将完整 HTML 放入 `resources/`，使用英文文件名，如 `resources/storage-architecture.html`。原有 HTML 的内容和交互可以直接保留。
2. 在 `site-catalog.json` 的对应 `groups[].items` 下添加一项：

```json
{
  "id": "storage",
  "title": "存储架构知识地图",
  "url": "resources/storage-architecture.html",
  "description": "存储介质、数据库与分布式存储"
}
```

3. 执行 `node scripts/build-navigation.mjs`，自动更新首页、所有论文页侧栏，以及独立页面的返回主页和主题切换菜单。
4. 执行 `python3 tests/check_links.py`，检查页面、资源路径、目录锚点和原有章节完整性。提交页面、配置和生成结果。

新增分类只需在 `groups` 添加 `id`、`title`、`description`、`items`。资源 ID 必须唯一。本地路径必须指向实际存在的 HTML；外部站点使用完整 HTTPS 地址。外部入口自动在新标签页打开。

## 结构

- `site-catalog.json`：所有学习资源与分类的唯一导航配置。
- `scripts/build-navigation.mjs`：无第三方依赖的导航生成器；保留页面正文，只更新标记区和共享资源栏，可重复执行。
- `index.html`：学习入口，支持筛选。
- 五个论文主题 HTML：原有 32 章按主题分拆。
- `knowledge-map.html`：完整知识地图归档，兼容原首页章节链接。
- `resources/*.html`：独立学习页，包含大数据架构等资源。
- `resource-nav.css`：独立页面的公共主题菜单样式，限定 CSS 作用域。
- `app.js` / `styles.css`：论文页面搜索、主题、移动导航和图解。
- `tests/check_links.py`：静态站内链接及内容完整性检查，不依赖额外 Python 包。

## 本地运行与发布

```bash
node scripts/build-navigation.mjs
python3 tests/check_links.py
python3 -m http.server 8080
```

访问 `http://localhost:8080`。GitHub Actions 在 `main` 更新后自动生成导航、检查链接并部署静态文件到 GitHub Pages。菜单与正文由静态 HTML 提供，无需等待远程库；论文 Mermaid 图解仍使用 CDN。
