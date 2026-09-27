import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";

const contentEl = document.getElementById("content");
const tocEl = document.getElementById("toc");
const searchInput = document.getElementById("searchInput");
const searchStatus = document.getElementById("searchStatus");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const menuBtn = document.getElementById("menuBtn");
const themeToggle = document.getElementById("themeToggle");

const slugify = (text) =>
  text.toLowerCase()
    .trim()
    .replace(/[\s/]+/g, "-")
    .replace(/[^一-龥a-z0-9_-]/g, "")
    .replace(/-+/g, "-");

function setTheme(mode) {
  document.documentElement.classList.toggle("light", mode === "light");
  localStorage.setItem("thesis-theme", mode);
  mermaid.initialize({
    startOnLoad: false,
    theme: mode === "light" ? "default" : "neutral",
    securityLevel: "loose",
    mindmap: { padding: 18 },
    flowchart: { curve: "basis" }
  });
}

setTheme(localStorage.getItem("thesis-theme") || "dark");

themeToggle.addEventListener("click", async () => {
  const next = document.documentElement.classList.contains("light") ? "dark" : "light";
  setTheme(next);
  await renderMermaid();
});

menuBtn.addEventListener("click", () => {
  sidebar.classList.add("open");
  overlay.classList.add("show");
});
overlay.addEventListener("click", closeMenu);

function closeMenu() {
  sidebar.classList.remove("open");
  overlay.classList.remove("show");
}

function normalizeMermaidBlocks() {
  const codeBlocks = [...contentEl.querySelectorAll("pre > code.language-mermaid")];
  codeBlocks.forEach(code => {
    const wrap = document.createElement("div");
    wrap.className = "mermaid-wrap";
    const div = document.createElement("div");
    div.className = "mermaid";
    div.textContent = code.textContent;
    wrap.appendChild(div);
    code.parentElement.replaceWith(wrap);
  });
}

async function renderMermaid() {
  const nodes = [...contentEl.querySelectorAll(".mermaid")];
  nodes.forEach(n => n.removeAttribute("data-processed"));
  if (nodes.length) {
    try {
      await mermaid.run({ nodes });
    } catch (e) {
      console.error("Mermaid render failed:", e);
    }
  }
}

function buildToc() {
  const headings = [...contentEl.querySelectorAll("h1, h2, h3")];
  const used = new Map();

  headings.forEach(h => {
    let id = slugify(h.textContent) || "section";
    const n = used.get(id) || 0;
    used.set(id, n + 1);
    if (n) id += "-" + (n + 1);
    h.id = id;
  });

  tocEl.innerHTML = headings
    .filter(h => h.tagName !== "H3" || h.textContent.includes("思维导图"))
    .map(h => {
      const level = h.tagName === "H1" ? 1 : h.tagName === "H2" ? 2 : 3;
      return `<a class="level-${level}" href="#${h.id}">${h.textContent}</a>`;
    })
    .join("");

  tocEl.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMenu));

  const observer = new IntersectionObserver(entries => {
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
    if (!visible) return;
    tocEl.querySelectorAll("a").forEach(a => a.classList.remove("active"));
    const active = tocEl.querySelector(`a[href="#${visible.target.id}"]`);
    active?.classList.add("active");
  }, { rootMargin: "-15% 0px -75% 0px", threshold: 0 });

  headings.forEach(h => observer.observe(h));
}

function clearHighlights() {
  contentEl.querySelectorAll("mark.search-hit").forEach(mark => {
    mark.replaceWith(document.createTextNode(mark.textContent));
  });
  contentEl.normalize();
}

function highlight(term) {
  clearHighlights();
  searchStatus.hidden = true;
  const q = term.trim();
  if (!q) return;

  const walker = document.createTreeWalker(contentEl, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || ["SCRIPT", "STYLE", "CODE", "PRE", "SVG"].includes(parent.tagName)) {
        return NodeFilter.FILTER_REJECT;
      }
      return node.nodeValue.toLowerCase().includes(q.toLowerCase())
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_REJECT;
    }
  });

  const hits = [];
  let node;
  while ((node = walker.nextNode())) hits.push(node);

  hits.slice(0, 80).forEach(textNode => {
    const text = textNode.nodeValue;
    const lower = text.toLowerCase();
    const idx = lower.indexOf(q.toLowerCase());
    if (idx < 0) return;

    const frag = document.createDocumentFragment();
    frag.append(text.slice(0, idx));
    const mark = document.createElement("mark");
    mark.className = "search-hit";
    mark.textContent = text.slice(idx, idx + q.length);
    frag.append(mark);
    frag.append(text.slice(idx + q.length));
    textNode.replaceWith(frag);
  });

  searchStatus.hidden = false;
  searchStatus.textContent = hits.length
    ? `找到 ${hits.length} 处匹配“${q}”`
    : `没有找到“${q}”`;

  const first = contentEl.querySelector("mark.search-hit");
  first?.scrollIntoView({ behavior: "smooth", block: "center" });
}

searchInput.addEventListener("input", e => highlight(e.target.value));
document.addEventListener("keydown", e => {
  if (e.key === "/" && document.activeElement !== searchInput) {
    e.preventDefault();
    searchInput.focus();
  }
  if (e.key === "Escape") {
    searchInput.value = "";
    highlight("");
    closeMenu();
  }
});

async function init() {
  try {
    const response = await fetch("./content.md", { cache: "no-store" });
    if (!response.ok) throw new Error("无法读取 content.md");
    const md = await response.text();

    marked.setOptions({ gfm: true, breaks: false });
    contentEl.innerHTML = marked.parse(md);

    normalizeMermaidBlocks();
    buildToc();
    await renderMermaid();
  } catch (error) {
    contentEl.innerHTML = `
      <h2>页面加载失败</h2>
      <p>请确认站点通过 HTTP Server 或 GitHub Pages 访问，而不是直接打开本地 HTML 文件。</p>
      <pre>${String(error)}</pre>`;
  }
}

init();
