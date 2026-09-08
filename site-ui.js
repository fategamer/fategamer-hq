(function () {
  "use strict";

  const qs = (s, root = document) => root.querySelector(s);
  const qsa = (s, root = document) => Array.from(root.querySelectorAll(s));

  const sections = qsa("body > section, body > header.hero").filter((section) => section.id && section.id !== "top");

  // Add accessible section toggles without changing the existing visual structure.
  sections.forEach((section) => {
    const wrap = qs(".wrap", section);
    const head = qs(".sec-head", section);
    if (!wrap || !head || head.querySelector(".section-toggle")) return;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "section-toggle";
    button.setAttribute("aria-expanded", "true");
    button.setAttribute("aria-controls", `${section.id}-content`);
    button.innerHTML = "<span>Collapse section</span><span aria-hidden=\"true\">⌃</span>";

    const content = document.createElement("div");
    content.className = "section-content";
    content.id = `${section.id}-content`;

    while (head.nextSibling) content.appendChild(head.nextSibling);
    head.appendChild(button);
    wrap.appendChild(content);

    button.addEventListener("click", () => {
      const expanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!expanded));
      button.innerHTML = expanded
        ? "<span>Expand section</span><span aria-hidden=\"true\">⌄</span>"
        : "<span>Collapse section</span><span aria-hidden=\"true\">⌃</span>";
      content.hidden = expanded;
      section.classList.toggle("is-collapsed", expanded);
    });
  });

  // Global section controls.
  const toolbar = document.createElement("div");
  toolbar.className = "section-toolbar";
  toolbar.setAttribute("aria-label", "Page section controls");
  toolbar.innerHTML = '<button type="button" data-section-action="expand">Expand all</button><button type="button" data-section-action="collapse">Collapse all</button>';
  const firstSection = qs("body > section");
  if (firstSection) document.body.insertBefore(toolbar, firstSection);

  toolbar.addEventListener("click", (event) => {
    const action = event.target.closest("[data-section-action]")?.dataset.sectionAction;
    if (!action) return;
    qsa(".section-toggle").forEach((button) => {
      const shouldExpand = action === "expand";
      const content = document.getElementById(button.getAttribute("aria-controls"));
      button.setAttribute("aria-expanded", String(shouldExpand));
      button.innerHTML = shouldExpand
        ? "<span>Collapse section</span><span aria-hidden=\"true\">⌃</span>"
        : "<span>Expand section</span><span aria-hidden=\"true\">⌄</span>";
      if (content) content.hidden = !shouldExpand;
      button.closest("section")?.classList.toggle("is-collapsed", !shouldExpand);
    });
  });

  // FAQ accordion.
  qsa("[data-faq-button]").forEach((button) => {
    button.addEventListener("click", () => {
      const panel = document.getElementById(button.getAttribute("aria-controls"));
      if (!panel) return;
      const open = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!open));
      panel.hidden = open;
      button.querySelector(".faq-plus")?.replaceChildren(document.createTextNode(open ? "+" : "−"));
    });
  });

  // Mobile menu toggle.
  const burger = document.getElementById("burger");
  const menu = document.getElementById("menu");
  if (burger && menu) {
    burger.setAttribute("aria-expanded", "false");
    burger.addEventListener("click", () => {
      const open = menu.classList.toggle("open");
      burger.setAttribute("aria-expanded", String(open));
      burger.textContent = open ? "×" : "☰";
    });
    qsa("a", menu).forEach((link) => link.addEventListener("click", () => {
      menu.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
      burger.textContent = "☰";
    }));
  }

  // Back-to-top control.
  const top = document.createElement("a");
  top.className = "back-top";
  top.href = "#top";
  top.setAttribute("aria-label", "Back to top");
  top.textContent = "↑";
  document.body.appendChild(top);
  const syncTop = () => top.classList.toggle("show", window.scrollY > 700);
  window.addEventListener("scroll", syncTop, { passive: true });
  syncTop();
})();
