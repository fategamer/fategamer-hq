(function () {
  "use strict";

  const qs = (s, root = document) => root.querySelector(s);
  const qsa = (s, root = document) => Array.from(root.querySelectorAll(s));

  const style = document.createElement("style");
  style.textContent = `
    .section-toolbar{position:sticky;top:72px;z-index:6;display:flex;justify-content:flex-end;gap:8px;max-width:1180px;margin:0 auto;padding:10px 20px;background:rgba(7,7,6,.86);backdrop-filter:blur(12px);border-bottom:1px solid rgba(232,213,163,.08)}
    .section-toolbar button,.section-toggle{border:1px solid var(--line);background:rgba(212,180,106,.06);color:var(--gold-2);padding:8px 12px;border-radius:999px;font-size:12px;letter-spacing:.06em;text-transform:uppercase}
    .section-toolbar button:hover,.section-toggle:hover{background:rgba(212,180,106,.14);border-color:var(--gold)}
    .sec-head{position:relative}
    .section-toggle{display:inline-flex;align-items:center;gap:8px;margin-top:14px}
    .section-content{overflow:visible}
    section.is-collapsed .section-content{display:none}
    section.is-collapsed .sec-head{margin-bottom:0}
    .section-fallback-toggle{display:flex;justify-content:flex-end;margin-bottom:18px}
    .section-fallback-toggle .section-toggle{margin:0}
    .faq-list{display:grid;gap:10px}
    .faq-item{border:1px solid var(--line);background:rgba(255,255,255,.02);border-radius:14px;overflow:hidden}
    .faq-item button{width:100%;display:flex;justify-content:space-between;align-items:center;text-align:left;border:0;background:transparent;color:var(--ink);padding:18px 20px;font-weight:600}
    .faq-item button:hover{background:rgba(212,180,106,.06)}
    .faq-plus{color:var(--gold);font-size:22px;line-height:1}
    .faq-panel{padding:0 20px 18px;color:var(--mute)}
    .back-top{position:fixed;right:20px;bottom:20px;width:44px;height:44px;border:1px solid var(--line);border-radius:50%;display:grid;place-items:center;background:rgba(7,7,6,.9);color:var(--gold);z-index:20;opacity:0;pointer-events:none;transform:translateY(10px);transition:.2s}
    .back-top.show{opacity:1;pointer-events:auto;transform:none}
    .fg-enhancement{margin-top:28px;border-color:rgba(212,180,106,.22)}
    .fg-enhancement h3{font-family:"Cinzel",serif;font-size:24px;margin-bottom:8px}
    .fg-enhancement p{color:var(--mute)}
    .fg-toast{position:fixed;right:20px;bottom:20px;z-index:110;width:min(520px,calc(100% - 40px));padding:16px 18px;background:var(--bg-2);border:1px solid var(--gold);color:var(--gold-2);box-shadow:0 20px 60px rgba(0,0,0,.5);opacity:0;transform:translateY(10px);pointer-events:none;transition:.2s}
    .fg-toast.show{opacity:1;transform:none}
    @media(max-width:700px){.section-toolbar{top:60px;padding:8px 14px}.section-toolbar button{font-size:10px;padding:7px 9px}.section-toggle{font-size:10px}.back-top{right:14px;bottom:14px}.fg-toast{right:14px;bottom:14px;width:calc(100% - 28px)}}
  `;
  document.head.appendChild(style);

  const sections = qsa("body > section").filter((section) => section.id);

  function makeToggle(section, content) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "section-toggle";
    button.setAttribute("aria-expanded", "true");
    button.setAttribute("aria-controls", content.id);
    const render = (expanded) => {
      button.setAttribute("aria-expanded", String(expanded));
      button.innerHTML = expanded ? "<span>Collapse section</span><span aria-hidden=\"true\">⌃</span>" : "<span>Expand section</span><span aria-hidden=\"true\">⌄</span>";
    };
    render(true);
    button.addEventListener("click", () => {
      const expanded = button.getAttribute("aria-expanded") === "true";
      content.hidden = expanded;
      section.classList.toggle("is-collapsed", expanded);
      render(!expanded);
    });
    return button;
  }

  sections.forEach((section) => {
    const wrap = qs(".wrap", section);
    if (!wrap) return;
    const head = qs(".sec-head", section);
    const content = document.createElement("div");
    content.className = "section-content";
    content.id = `${section.id}-content`;
    if (head) {
      while (head.nextSibling) content.appendChild(head.nextSibling);
      head.appendChild(makeToggle(section, content));
      wrap.appendChild(content);
    } else {
      const fallback = document.createElement("div");
      fallback.className = "section-fallback-toggle";
      fallback.appendChild(makeToggle(section, content));
      const nodes = Array.from(wrap.childNodes);
      nodes.forEach((node) => content.appendChild(node));
      wrap.appendChild(fallback);
      wrap.appendChild(content);
    }
  });

  const toolbar = document.createElement("div");
  toolbar.className = "section-toolbar";
  toolbar.setAttribute("aria-label", "Page section controls");
  toolbar.innerHTML = '<button type="button" data-section-action="expand">Expand all</button><button type="button" data-section-action="collapse">Collapse all</button>';
  const firstSection = qs("body > section");
  if (firstSection) document.body.insertBefore(toolbar, firstSection);
  toolbar.addEventListener("click", (event) => {
    const action = event.target.closest("[data-section-action]")?.dataset.sectionAction;
    if (!action) return;
    const shouldExpand = action === "expand";
    qsa(".section-toggle").forEach((button) => {
      const content = document.getElementById(button.getAttribute("aria-controls"));
      button.setAttribute("aria-expanded", String(shouldExpand));
      button.innerHTML = shouldExpand ? "<span>Collapse section</span><span aria-hidden=\"true\">⌃</span>" : "<span>Expand section</span><span aria-hidden=\"true\">⌄</span>";
      if (content) content.hidden = !shouldExpand;
      button.closest("section")?.classList.toggle("is-collapsed", !shouldExpand);
    });
  });

  qsa("[data-faq-button]").forEach((button) => {
    button.addEventListener("click", () => {
      const panel = document.getElementById(button.getAttribute("aria-controls"));
      if (!panel) return;
      const open = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!open));
      panel.hidden = open;
      const icon = button.querySelector(".faq-plus");
      if (icon) icon.textContent = open ? "+" : "−";
    });
  });

  const top = document.createElement("a");
  top.className = "back-top";
  top.href = "#top";
  top.setAttribute("aria-label", "Back to top");
  top.textContent = "↑";
  document.body.appendChild(top);
  const syncTop = () => top.classList.toggle("show", window.scrollY > 700);
  window.addEventListener("scroll", syncTop, { passive: true });
  syncTop();

  // Load the deeper interaction layer after the existing UI is ready.
  const enhancements = document.createElement("script");
  enhancements.src = "enhancements.js";
  enhancements.defer = true;
  document.body.appendChild(enhancements);
})();
