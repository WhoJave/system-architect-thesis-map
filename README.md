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

## 论文技术术语图解

`resources/architecture-terms.html` 面向有前端基础、后端入门的学习者，包含 44 节讲解及 SVG 原理图，覆盖基础、缓存、MQ、一致性、DDD、微服务、弹性、RAG 和 Agent。每节提供前端类比、工程细节、消费金融教学案例、方案边界、论文表达和主动回忆；另含三个失败窗口实验。

- 内容数据：`data/technical-guide.json`。按分组添加卡片，填写定义、类比、细节、图节点、边界、案例、表达与参考资料；ID 保持稳定以便论文页深链。
- 图文生成：`node scripts/build-technical-guide.mjs`。静态输出全部正文和 SVG，并在六个论文页面的首次术语出现处生成解释链接。
- 页面交互：`technical-guide.js` / `technical-guide.css`。不依赖 CDN；支持搜索、分类、逐步点亮、回忆答案、复制表达与本地已理解标记。
- 验证：`node tests/technical-guide.cjs` 检查重复投递、未决交易和容量瓶颈的教学模型，以及内容和原理图的完整性。

发布顺序是先生成术语页与深链，再生成全站导航，最后运行教学模型和站内链接检查。扩展术语时无需手改页面，复用稳定的 JSON 结构即可。
