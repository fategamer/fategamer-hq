(function () {
  "use strict";

  const C = window.FG;
  if (!C) {
    console.error("FATE GAMER content failed to load.");
    return;
  }

  const $ = (id) => document.getElementById(id);
  const setText = (id, value) => {
    const el = $(id);
    if (el) el.textContent = value ?? "";
    return el;
  };

  const externalLink = (href, label, className = "chip") => {
    const a = document.createElement("a");
    a.className = className;
    a.href = href || "#";
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.textContent = label;
    return a;
  };

  // Featured release
  if (C.featured) {
    setText("feat-title", C.featured.title);
    setText("feat-type", `FATE GAMER · ${C.featured.type || "Release"}`);
    setText("feat-blurb", C.featured.blurb);
    const cover = $("feat-cover");
    if (cover && C.featured.cover) cover.src = C.featured.cover;
  }

  const platforms = $("platforms");
  const listenLabels = {
    spotify: "Spotify",
    apple: "Apple Music",
    youtubeMusic: "YouTube Music",
    audiomack: "Audiomack",
    boomplay: "Boomplay"
  };
  if (platforms && C.listen) {
    Object.entries(C.listen).forEach(([key, href]) => {
      if (href) platforms.appendChild(externalLink(href, listenLabels[key] || key));
    });
  }

  // Releases
  const releases = $("releases");
  if (releases && Array.isArray(C.releases)) {
    C.releases.forEach((r) => {
      const a = document.createElement("a");
      a.className = "card";
      a.href = r.href || "#";
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.innerHTML = `<img src="${r.cover || ""}" alt="${r.title || "Release"}" loading="lazy"><div class="pad"><small>${r.meta || ""}</small><h3>${r.title || "Untitled"}</h3><small>${r.note || ""}</small></div>`;
      releases.appendChild(a);
    });
  }

  // Vault
  const vault = $("vault");
  if (vault && Array.isArray(C.vault)) {
    C.vault.forEach((r) => {
      const el = document.createElement("article");
      el.className = "card";
      el.innerHTML = `<img src="${r.cover || ""}" alt="${r.title || "Unreleased"}" loading="lazy"><div class="pad"><small>${r.meta || ""}</small><h3>${r.title || "Untitled"}</h3><small>${r.note || ""}</small></div>`;
      vault.appendChild(el);
    });
  }

  // Merchandise
  const merchGrid = $("merch-grid");
  if (merchGrid && Array.isArray(C.merchandise)) {
    C.merchandise.forEach((item) => {
      const card = document.createElement("article");
      card.className = "card";
      card.innerHTML = `<img src="${item.image || ""}" alt="${item.title || "Merchandise"}" loading="lazy"><div class="pad"><small>${item.price || ""}</small><h3>${item.title || "Item"}</h3><small>${item.desc || ""}</small></div>`;
      merchGrid.appendChild(card);
    });
  }

  // Membership tiers
  const tiersGrid = $("tiers-grid");
  if (tiersGrid && Array.isArray(C.tiers)) {
    C.tiers.forEach((tier) => {
      const card = document.createElement("article");
      card.className = `card tier${tier.featured ? " featured-tier" : ""}`;
      const benefits = Array.isArray(tier.benefits) ? tier.benefits.map((b) => `<li>${b}</li>`).join("") : "";
      card.innerHTML = `<div class="pad"><small>MEMBERSHIP</small><h3>${tier.name || "TIER"}</h3><p class="big-stat">${tier.price || ""}<small>${tier.period || ""}</small></p><ul>${benefits}</ul><a class="btn gold" href="#contact">Join ${tier.name || "Tier"}</a></div>`;
      tiersGrid.appendChild(card);
    });
  }

  // VIP experiences
  const expGrid = $("exp-grid");
  if (expGrid && Array.isArray(C.experiences)) {
    C.experiences.forEach((service) => {
      const card = document.createElement("article");
      card.className = "card";
      card.innerHTML = `<div class="pad"><div class="press-icon">${service.icon || "⭐"}</div><h3>${service.title || "Experience"}</h3><p>${service.desc || ""}</p><p class="big-stat">${service.price || ""}</p><a class="btn ghost" href="#contact">Inquire</a></div>`;
      expGrid.appendChild(card);
    });
  }

  // Events
  const eventList = $("event-list");
  if (eventList) {
    if (!Array.isArray(C.events) || C.events.length === 0) {
      eventList.innerHTML = `<div class="empty">Upcoming dates land here first. Follow FATE GAMER — you will know before the room fills.</div>`;
    } else {
      C.events.forEach((e) => {
        const row = document.createElement("a");
        row.className = "event";
        row.href = e.ticket || e.link || "#contact";
        if (row.href !== "#contact") {
          row.target = "_blank";
          row.rel = "noopener noreferrer";
        }
        row.innerHTML = `<div><strong>${e.title || e.venue || "Live Event"}</strong><div style="color:var(--mute)">📍 ${e.venue || ""}${e.city ? ` · ${e.city}` : ""}</div></div><div>📅 ${e.date || "TBA"}</div>`;
        eventList.appendChild(row);
      });
    }
  }

  // Collaborations
  const collabGrid = $("collab-grid");
  if (collabGrid && Array.isArray(C.collaborations)) {
    C.collaborations.forEach((collab) => {
      const card = document.createElement("article");
      card.className = "card";
      card.innerHTML = `<div class="pad"><small>COLLABORATION</small><h3>${collab.name || "Artist"}</h3><p>${collab.project || "Creative project"}</p>${collab.link && collab.link !== "#" ? `<a class="btn ghost" href="${collab.link}" target="_blank" rel="noopener noreferrer">Explore</a>` : ""}</div>`;
      collabGrid.appendChild(card);
    });
  }

  // Testimonials
  const testimonialsGrid = $("testimonials-grid");
  if (testimonialsGrid && Array.isArray(C.testimonials)) {
    C.testimonials.forEach((t) => {
      const card = document.createElement("article");
      card.className = "card";
      card.innerHTML = `<div class="pad"><p class="quote">“${t.quote || ""}”</p><h3>${t.author || "Anonymous"}</h3><small>${t.role || ""}</small></div>`;
      testimonialsGrid.appendChild(card);
    });
  }

  // Projects
  const projects = $("projects-list");
  if (projects && Array.isArray(C.projects)) {
    C.projects.forEach((p) => {
      const el = document.createElement("article");
      el.className = "project";
      el.innerHTML = `<div class="k">${p.kicker || "Project"}</div><h3>${p.title || "Untitled"}</h3><p>${p.text || ""}</p><a href="${p.href || "#"}" target="_blank" rel="noopener noreferrer">${p.cta || "Explore"} →</a>`;
      projects.appendChild(el);
    });
  }

  // Social links
  const follow = $("follow-row");
  if (follow && C.socials) {
    const followItems = [
      ["Instagram", C.socials.instagram], ["TikTok", C.socials.tiktok],
      ["YouTube", C.socials.youtube], ["Spotify", C.listen?.spotify],
      ["Apple Music", C.listen?.apple], ["Facebook", C.socials.facebook],
      ["X", C.socials.x], ["LinkedIn", C.socials.linkedin]
    ];
    followItems.forEach(([label, href]) => {
      if (href) follow.appendChild(externalLink(href, label, ""));
    });
  }

  const all = $("all-links");
  if (all && C.socials && C.listen) {
    const directory = [
      ["Instagram — FATE GAMER", C.socials.instagram], ["Instagram — TRAP SAINT", C.socials.instagramAlt],
      ["TikTok", C.socials.tiktok], ["TikTok — TRAP SAINT", C.socials.tiktokAlt],
      ["YouTube", C.socials.youtube], ["X / Twitter", C.socials.x], ["Facebook", C.socials.facebook],
      ["Threads", C.socials.threads], ["Spotify", C.listen.spotify], ["Apple Music", C.listen.apple],
      ["YouTube Music", C.listen.youtubeMusic], ["Audiomack", C.listen.audiomack],
      ["Boomplay", C.listen.boomplay], ["LinkedIn", C.socials.linkedin],
      ["GSCN", "https://gscn-network.vercel.app"], ["GitHub", C.socials.github]
    ];
    directory.forEach(([label, href]) => {
      if (!href) return;
      const a = document.createElement("a");
      a.href = href;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.innerHTML = `<span>${label}</span><span>OPEN</span>`;
      all.appendChild(a);
    });
  }

  // Booking/contact form
  const form = $("form");
  if (form && C.email) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      const body = encodeURIComponent(`${data.reason || "Inquiry"}\n\n${data.message || ""}\n\nFrom: ${data.name || ""} <${data.email || ""}>`);
      window.location.href = `mailto:${C.email}?subject=${encodeURIComponent("FATE GAMER — " + (data.reason || "Inquiry"))}&body=${body}`;
      setText("form-note", "Opening your mail app…");
    });
  }

  // Newsletter
  const newsletterForm = $("newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = new FormData(newsletterForm).get("email");
      const note = $("newsletter-note");
      if (note) note.textContent = email ? "You're on the list. Welcome to the movement." : "Please enter your email.";
      newsletterForm.reset();
    });
  }

  // Image fallback
  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("error", () => {
      img.style.visibility = "hidden";
    });
  });

  // Mobile menu
  const menu = $("menu");
  const burger = $("burger");
  if (menu && burger) {
    burger.addEventListener("click", () => {
      const open = menu.style.display === "flex";
      menu.style.display = open ? "none" : "flex";
      burger.setAttribute("aria-expanded", String(!open));
    });
    menu.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        menu.style.display = "none";
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }
})();
