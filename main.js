import { apiRegistry } from "./apis/registry.js";

const sideNav = document.getElementById("side-nav");
const moduleGrid = document.getElementById("api-module-grid");
const detailAnchor = document.getElementById("api-detail-anchor");
const statEndpoints = document.getElementById("stat-endpoints");
const yearNode = document.getElementById("year");

let navLinks = [];
let sectionObserver;

const staticNavSections = [
  { id: "overview", label: "Обзор" },
  { id: "about", label: "О нас" },
  { id: "getting-started", label: "Старт" },
  { id: "api-directory", label: "Каталог" },
  { id: "policies", label: "Политики" }
];

document.addEventListener("DOMContentLoaded", async () => {
  if (yearNode) {
    yearNode.textContent = new Date().getFullYear();
  }

  // Remove deprecated "About" section entirely
  const aboutSection = document.getElementById("about");
  if (aboutSection) {
    aboutSection.remove();
  }

  if (moduleGrid) {
    moduleGrid.innerHTML = '<div class="empty-state">Загружаем список API…</div>';
  }

  try {
    const docs = await loadApiModules();
    applyRuntimeDocOverrides(docs);
    renderNav(docs);
    renderModuleCards(docs);
    renderApiSections(docs);
    updateEndpointStats(docs);
    observeSections();
  } catch (error) {
    console.error("API modules loading error", error);
    if (moduleGrid) {
      moduleGrid.innerHTML = '<div class="empty-state">Не удалось загрузить список API. Проверьте консоль.</div>';
    }
  }
});

function applyRuntimeDocOverrides(docs) {
  const targetSlugs = new Set(["defi-index", "altcoin-index"]);
  docs.forEach((entry) => {
    const doc = entry.doc;
    if (!doc || !targetSlugs.has(doc.slug)) return;
    doc.rateLimit = "30 req/min per IP";
    if (Array.isArray(doc.endpoints)) {
      doc.endpoints.forEach((ep) => {
        if (!ep) return;
        ep.rateLimit = "30 req/min";
        // Add documented CORS response headers
        const corsHeaders = [
          { name: "Access-Control-Allow-Origin", required: false, description: "*, response header (CORS)." },
          { name: "Access-Control-Allow-Methods", required: false, description: "GET, response header (CORS)." },
          { name: "Access-Control-Allow-Headers", required: false, description: "*, response header (CORS)." },
        ];
        ep.headers = Array.isArray(ep.headers) && ep.headers.length
          ? ep.headers
          : corsHeaders;

        if (Array.isArray(ep.errors)) {
          ep.errors = ep.errors.map((err) =>
            err && err.code === 429
              ? { ...err, description: "Too many requests: 30 req/min limit." }
              : err
          );
        }
      });
    }
  });
}

async function loadApiModules() {
  const modules = await Promise.all(
    apiRegistry.map(async (entry) => {
      const mod = await import(entry.modulePath);
      if (!mod || !mod.apiDoc) {
        throw new Error(`Модуль ${entry.modulePath} не экспортирует apiDoc`);
      }
      return { ...entry, doc: mod.apiDoc };
    })
  );
  return modules;
}

function renderNav(docs) {
  if (!sideNav) return;
  sideNav.innerHTML = "";

  const fragment = document.createDocumentFragment();
  fragment.appendChild(createNavSection("Документация", staticNavSections));

  if (docs.length) {
    const apiItems = docs.map(({ doc }) => ({ id: `api-${doc.slug}`, label: doc.name }));
    fragment.appendChild(createNavSection("API", apiItems));
  }

  sideNav.appendChild(fragment);
  navLinks = Array.from(sideNav.querySelectorAll("a.nav-link"));
  navLinks.forEach((link) => link.addEventListener("click", handleNavClick));
}

function handleNavClick(event) {
  navLinks.forEach((link) => link.classList.remove("active"));
  event.currentTarget.classList.add("active");
}

function createNavSection(title, items) {
  const wrapper = document.createElement("div");
  wrapper.className = "nav-section";

  const label = document.createElement("div");
  label.className = "section-label";
  label.textContent = title;
  wrapper.appendChild(label);

  const list = document.createElement("ul");
  list.className = "nav-list";

  items.forEach((item) => {
    // Skip deprecated "About" from side menu
    if (item.id === "about") return;
    const li = document.createElement("li");
    const link = document.createElement("a");
    link.className = "nav-link";
    link.href = `#${item.id}`;
    link.textContent = item.label;
    li.appendChild(link);
    list.appendChild(li);
  });

  wrapper.appendChild(list);
  return wrapper;
}

function renderModuleCards(docs) {
  if (!moduleGrid) return;
  moduleGrid.innerHTML = "";

  if (!docs.length) {
    moduleGrid.innerHTML = '<div class="empty-state">Каталог модулей пока пуст.</div>';
    return;
  }

  docs.forEach(({ doc }) => {
    const card = document.createElement("article");
    card.className = "api-card";

    const badge = document.createElement("span");
    badge.className = doc.status === "Stable" ? "badge success" : "badge";
    badge.textContent = doc.status || "Status";
    card.appendChild(badge);

    const title = document.createElement("h3");
    title.textContent = doc.name;
    card.appendChild(title);

    const tagline = document.createElement("p");
    tagline.className = "tagline";
    tagline.textContent = doc.summary;
    card.appendChild(tagline);

    if (doc.tags?.length) {
      const meta = document.createElement("div");
      meta.className = "meta";
      doc.tags.forEach((tag) => {
        const pill = document.createElement("span");
        pill.className = "meta-item";
        pill.textContent = tag;
        meta.appendChild(pill);
      });
      card.appendChild(meta);
    }

    const link = document.createElement("a");
    link.href = `#api-${doc.slug}`;
    link.className = "nav-link";
    link.textContent = "Перейти к документации";
    card.appendChild(link);

    moduleGrid.appendChild(card);
  });
}

function renderApiSections(docs) {
  if (!detailAnchor) return;
  detailAnchor.innerHTML = "";

  docs.forEach(({ doc }) => {
    const section = document.createElement("section");
    section.className = "api-section";
    section.id = `api-${doc.slug}`;

    if (doc.group) {
      const kicker = document.createElement("div");
      kicker.className = "section-kicker";
      kicker.textContent = doc.group;
      section.appendChild(kicker);
    }

    const title = document.createElement("h2");
    title.textContent = doc.name;
    section.appendChild(title);

    if (doc.summary) {
      const summary = document.createElement("p");
      summary.className = "summary";
      summary.textContent = doc.summary;
      section.appendChild(summary);
    }

    if (doc.description) {
      const desc = document.createElement("p");
      desc.textContent = doc.description;
      section.appendChild(desc);
    }

    const infoGrid = buildInfoGrid(doc);
    if (infoGrid) {
      section.appendChild(infoGrid);
    }

    doc.endpoints?.forEach((endpoint) => {
      const endpointCard = buildEndpointCard(endpoint, doc);
      section.appendChild(endpointCard);
    });

    if (doc.compliance?.length) {
      const complianceTitle = document.createElement("div");
      complianceTitle.className = "section-kicker";
      complianceTitle.textContent = "Комплаенс";
      section.appendChild(complianceTitle);

      const complianceList = document.createElement("ul");
      complianceList.className = "notes";
      doc.compliance.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        complianceList.appendChild(li);
      });
      section.appendChild(complianceList);
    }

    if (doc.changelog?.length) {
      const changelog = document.createElement("div");
      changelog.className = "changelog";

      const heading = document.createElement("h3");
      heading.textContent = "Изменения";
      changelog.appendChild(heading);

      const list = document.createElement("ul");
      list.className = "changelog-list";

      doc.changelog.forEach((item) => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${item.date}</strong> — ${item.note}`;
        list.appendChild(li);
      });

      changelog.appendChild(list);
      section.appendChild(changelog);
    }

    detailAnchor.appendChild(section);
  });
}

function buildInfoGrid(doc) {
  const cards = [];

  if (doc.version) cards.push({ label: "Версия", value: doc.version });
  if (doc.status) cards.push({ label: "Статус", value: doc.status });
  if (doc.baseUrl) cards.push({ label: "Base URL", value: doc.baseUrl });
  if (doc.authentication) cards.push({ label: "Аутентификация", value: doc.authentication });
  if (doc.rateLimit) cards.push({ label: "Лимиты", value: doc.rateLimit });
  if (doc.serviceLevel) cards.push({ label: "SLA", value: doc.serviceLevel });

  if (doc.metrics?.length) {
    doc.metrics.forEach((metric) => {
      cards.push({ label: metric.label, value: metric.value });
    });
  }

  if (!cards.length) return null;

  const grid = document.createElement("div");
  grid.className = "info-grid";

  cards.forEach((item) => {
    const card = document.createElement("div");
    card.className = "info-card";

    const label = document.createElement("div");
    label.className = "label";
    label.textContent = item.label;
    card.appendChild(label);

    const value = document.createElement("div");
    value.className = "value";
    value.textContent = item.value;
    card.appendChild(value);

    grid.appendChild(card);
  });

  return grid;
}

function buildEndpointCard(endpoint, doc) {
  const wrapper = document.createElement("article");
  wrapper.className = "endpoint-card";

  const meta = document.createElement("div");
  meta.className = "endpoint-meta";

  const method = document.createElement("span");
  method.className = "method";
  method.textContent = endpoint.method;
  meta.appendChild(method);

  const url = document.createElement("span");
  url.className = "endpoint-url";
  url.textContent = `${doc.baseUrl}${endpoint.path}`;
  meta.appendChild(url);

  if (doc.version) {
    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = doc.version;
    meta.appendChild(badge);
  }

  wrapper.appendChild(meta);

  const description = document.createElement("p");
  description.textContent = endpoint.description;
  wrapper.appendChild(description);

  const metaList = document.createElement("ul");
  metaList.className = "notes";
  metaList.style.marginTop = "12px";
  metaList.style.paddingLeft = "18px";

  if (endpoint.scope) {
    const scopeItem = document.createElement("li");
    scopeItem.innerHTML = `<strong>Доступ:</strong> ${endpoint.scope}`;
    metaList.appendChild(scopeItem);
  }

  if (endpoint.rateLimit) {
    const rateItem = document.createElement("li");
    rateItem.innerHTML = `<strong>Rate limit:</strong> ${endpoint.rateLimit}`;
    metaList.appendChild(rateItem);
  }

  if (endpoint.cache) {
    const cacheItem = document.createElement("li");
    cacheItem.innerHTML = `<strong>Кэширование:</strong> ${endpoint.cache}`;
    metaList.appendChild(cacheItem);
  }

  if (metaList.childElementCount) {
    wrapper.appendChild(metaList);
  }

  if (endpoint.query?.length) {
    const queryTable = buildTable("Query параметры", endpoint.query, ["name", "type", "required", "description"]);
    wrapper.appendChild(queryTable);
  }

  if (endpoint.headers?.length) {
    const headerTable = buildTable("Заголовки", endpoint.headers, ["name", "required", "description"]);
    wrapper.appendChild(headerTable);
  }

  if (endpoint.response) {
    const response = endpoint.response;
    if (response.schema?.length) {
      const schemaTable = buildTable("Структура ответа", response.schema, ["field", "type", "description"]);
      wrapper.appendChild(schemaTable);
    }

    if (response.example) {
      const codeBlock = document.createElement("div");
      codeBlock.className = "code-sample";
      const title = document.createElement("div");
      title.className = "code-title";
      title.textContent = "Пример ответа";
      codeBlock.appendChild(title);
      const pre = document.createElement("pre");
      const code = document.createElement("code");
      code.textContent = response.example;
      pre.appendChild(code);
      codeBlock.appendChild(pre);
      wrapper.appendChild(codeBlock);
    }
  }

  if (endpoint.notes?.length) {
    const list = document.createElement("ul");
    list.className = "notes";
    endpoint.notes.forEach((note) => {
      const item = document.createElement("li");
      item.textContent = note;
      list.appendChild(item);
    });
    wrapper.appendChild(list);
  }

  if (endpoint.codeSamples?.length) {
    const codeTabs = createCodeTabs(endpoint.codeSamples, doc, endpoint);
    wrapper.appendChild(codeTabs);
  }

  if (endpoint.errors?.length) {
    const errorTitle = document.createElement("div");
    errorTitle.className = "code-title";
    errorTitle.textContent = "Ошибки";
    wrapper.appendChild(errorTitle);

    const table = document.createElement("table");
    table.className = "error-table";

    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");
    ["Код", "Сообщение", "Описание"].forEach((col) => {
      const th = document.createElement("th");
      th.textContent = col;
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    endpoint.errors.forEach((err) => {
      const tr = document.createElement("tr");
      const tdCode = document.createElement("td");
      tdCode.textContent = String(err.code);
      tr.appendChild(tdCode);

      const tdMsg = document.createElement("td");
      tdMsg.textContent = err.message;
      tr.appendChild(tdMsg);

      const tdDesc = document.createElement("td");
      tdDesc.textContent = err.description;
      tr.appendChild(tdDesc);

      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    wrapper.appendChild(table);
  }

  return wrapper;
}

function createCodeTabs(samples, doc, endpoint) {
  const tabsWrapper = document.createElement("div");
  tabsWrapper.className = "code-tabs";

  const tabList = document.createElement("div");
  tabList.className = "code-tab-list";

  const panesWrapper = document.createElement("div");
  panesWrapper.className = "code-tab-panes";

  samples.forEach((sample, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "code-tab";
    button.textContent = sample.label;

    const paneId = `${sanitizeId(doc.slug)}-${sanitizeId(endpoint.path || endpoint.name || "endpoint")}-${sanitizeId(sample.label)}-${index}`;
    button.dataset.target = paneId;
    if (index === 0) {
      button.classList.add("active");
    }
    tabList.appendChild(button);

    const pane = document.createElement("div");
    pane.className = "code-tab-pane";
    pane.dataset.pane = paneId;
    if (index === 0) {
      pane.classList.add("active");
    }

    const title = document.createElement("div");
    title.className = "code-title";
    title.textContent = `Пример: ${sample.label}`;
    pane.appendChild(title);

    const pre = document.createElement("pre");
    const code = document.createElement("code");
    code.textContent = sample.code;
    pre.appendChild(code);
    pane.appendChild(pre);

    panesWrapper.appendChild(pane);
  });

  tabsWrapper.appendChild(tabList);
  tabsWrapper.appendChild(panesWrapper);

  const buttons = tabList.querySelectorAll(".code-tab");
  const panes = panesWrapper.querySelectorAll(".code-tab-pane");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.target;
      buttons.forEach((button) => button.classList.remove("active"));
      panes.forEach((pane) => pane.classList.remove("active"));
      btn.classList.add("active");
      const pane = panesWrapper.querySelector(`[data-pane="${target}"]`);
      if (pane) {
        pane.classList.add("active");
      }
    });
  });

  return tabsWrapper;
}

function buildTable(captionText, rows, columns) {
  if (!rows || !rows.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = `${captionText}: не требуется`;
    return empty;
  }

  const table = document.createElement("table");
  table.className = "table";

  const caption = document.createElement("caption");
  caption.textContent = captionText;
  table.appendChild(caption);

  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");
  columns.forEach((col) => {
    const th = document.createElement("th");
    th.textContent = translateColumn(col);
    headRow.appendChild(th);
  });
  thead.appendChild(headRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  rows.forEach((row) => {
    const tr = document.createElement("tr");
    columns.forEach((col) => {
      const td = document.createElement("td");
      let value = row[col];
      if (typeof value === "boolean") {
        value = value ? "Да" : "Нет";
      }
      td.textContent = value ?? "—";
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  return table;
}

function translateColumn(key) {
  switch (key) {
    case "name":
      return "Параметр";
    case "type":
      return "Тип";
    case "required":
      return "Обязательный";
    case "description":
      return "Описание";
    case "field":
      return "Поле";
    default:
      return key;
  }
}

function updateEndpointStats(docs) {
  if (!statEndpoints) return;
  const total = docs.reduce((sum, item) => sum + (item.doc.endpoints?.length || 0), 0);
  statEndpoints.textContent = total;
}

function observeSections() {
  if (!sideNav) return;
  if (sectionObserver) {
    sectionObserver.disconnect();
  }

  if (!navLinks.length) return;

  const targets = navLinks
    .map((link) => {
      const id = link.getAttribute("href");
      if (!id || !id.startsWith("#")) return null;
      return document.getElementById(id.slice(1));
    })
    .filter(Boolean);

  sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach((link) => {
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      });
    },
    { rootMargin: "-45% 0px -45% 0px", threshold: 0.08 }
  );

  targets.forEach((target) => sectionObserver.observe(target));
}

function sanitizeId(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
