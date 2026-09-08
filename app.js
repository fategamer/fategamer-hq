(function () {
  "use strict";

  const C = window.FG;
  if (!C) return console.error("FATE GAMER content failed to load.");

  const $ = (id) => document.getElementById(id);
  const esc = (value) => String(value ?? "").replace(/[&<>\"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const setText = (id, value) => { const el = $(id); if (el) el.textContent = value ?? ""; return el; };
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
    const listen = $("feat-listen");
    if (cover && C.featured.cover) cover.src = C.featured.cover;
    if (listen && C.featured.href) listen.href = C.featured.href;
  }

  // Streaming platforms
  const platforms = $("platforms");
  const listenLabels = { spotify: "Spotify", apple: "Apple Music", youtubeMusic: "YouTube Music", audiomack: "Audiomack", boomplay: "Boomplay" };
  if (platforms && C.listen) Object.entries(C.listen).forEach(([key, href]) => href && platforms.appendChild(externalLink(href, listenLabels[key] || key)));

  // Generic release cards
  const releases = $("releases");
  if (releases && Array.isArray(C.releases)) C.releases.forEach((r) => {
    const a = document.createElement("a");
    a.className = "card";
    a.href = r.href || "#";
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.innerHTML = `<img src="${esc(r.cover)}" alt="${esc(r.title || "Release")}" loading="lazy"><div class="pad"><small>${esc(r.meta)}</small><h3>${esc(r.title || "Untitled")}</h3><small>${esc(r.note)}</small></div>`;
    releases.appendChild(a);
  });

  const vault = $("vault");
  if (vault && Array.isArray(C.vault)) C.vault.forEach((r) => {
    const el = document.createElement("article");
    el.className = "card";
    el.innerHTML = `<img src="${esc(r.cover)}" alt="${esc(r.title || "Unreleased")}" loading="lazy"><div class="pad"><small>${esc(r.meta)}</small><h3>${esc(r.title || "Untitled")}</h3><small>${esc(r.note)}</small></div>`;
    vault.appendChild(el);
  });

  // Checkout modal
  const modal = document.createElement("div");
  modal.className = "fg-modal";
  modal.hidden = true;
  modal.innerHTML = `<div class="fg-modal-backdrop" data-close="1"></div><div class="fg-modal-card" role="dialog" aria-modal="true" aria-labelledby="checkout-title"><button class="fg-modal-close" type="button" aria-label="Close">×</button><p class="kicker">SECURE CHECKOUT</p><h2 id="checkout-title">Complete your order</h2><p class="fg-modal-product" id="checkout-product"></p><form id="checkout-form"><input type="hidden" name="productId"><input name="name" placeholder="Full name" autocomplete="name" required><input type="email" name="email" placeholder="Email address" autocomplete="email" required><input name="phone" placeholder="Phone / WhatsApp (optional)" autocomplete="tel"><textarea name="shippingAddress" placeholder="Shipping address (required for physical products)"></textarea><button class="btn gold" type="submit">Continue to secure payment</button><p class="origin" id="checkout-note">Payment is handled securely by Paystack. Available payment methods depend on your checkout and location.</p></form></div>`;
  document.body.appendChild(modal);
  const checkoutForm = $("checkout-form");
  const checkoutProduct = $("checkout-product");
  const openCheckout = (item, type) => {
    if (!item || !checkoutForm) return;
    if (type === "membership") {
      document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    checkoutForm.productId.value = item.id;
    checkoutProduct.textContent = `${item.title} · ${item.price}`;
    checkoutForm.shippingAddress.required = type === "merch";
    checkoutForm.shippingAddress.placeholder = type === "merch" ? "Shipping address" : "Project / delivery notes (optional)";
    modal.hidden = false;
    document.body.classList.add("modal-open");
    checkoutForm.name.focus();
  };
  const closeModal = () => { modal.hidden = true; document.body.classList.remove("modal-open"); };
  modal.querySelectorAll("[data-close], .fg-modal-close").forEach((el) => el.addEventListener("click", closeModal));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.hidden) closeModal(); });

  // Merchandise
  const merchGrid = $("merch-grid");
  if (merchGrid && Array.isArray(C.merchandise)) C.merchandise.forEach((item) => {
    const card = document.createElement("article");
    card.className = "card sales-card";
    card.innerHTML = `<img src="${esc(item.image)}" alt="${esc(item.title)}" loading="lazy"><div class="pad"><small>${esc(item.price)}</small><h3>${esc(item.title)}</h3><p>${esc(item.desc)}</p><button class="btn gold buy-btn" type="button">Buy now</button></div>`;
    card.querySelector(".buy-btn").addEventListener("click", () => openCheckout(item, "merch"));
    merchGrid.appendChild(card);
  });

  // Membership tiers
  const tiersGrid = $("tiers-grid");
  if (tiersGrid && Array.isArray(C.tiers)) C.tiers.forEach((tier) => {
    const card = document.createElement("article");
    card.className = `card tier${tier.featured ? " featured-tier" : ""}`;
    const benefits = (tier.benefits || []).map((b) => `<li>${esc(b)}</li>`).join("");
    card.innerHTML = `<div class="pad"><small>MEMBERSHIP</small><h3>${esc(tier.name)}</h3><p class="big-stat">${esc(tier.price)}<small>${esc(tier.period)}</small></p><ul>${benefits}</ul><button class="btn gold join-btn" type="button">Request ${esc(tier.name)} access</button></div>`;
    card.querySelector(".join-btn").addEventListener("click", () => {
      const reason = $("form")?.querySelector("[name=reason]");
      if (reason) reason.value = "Membership / Community";
      const message = $("form")?.querySelector("[name=message]");
      if (message) message.value = `I want to join the ${tier.name} membership at ${tier.price}${tier.period}. Please send me the payment and access details.`;
      $("contact")?.scrollIntoView({ behavior: "smooth" });
    });
    tiersGrid.appendChild(card);
  });

  // Premium services / experiences
  const expGrid = $("exp-grid");
  if (expGrid && Array.isArray(C.experiences)) C.experiences.forEach((service) => {
    const card = document.createElement("article");
    card.className = "card sales-card";
    card.innerHTML = `<div class="pad"><div class="press-icon">${esc(service.icon || "⭐")}</div><h3>${esc(service.title)}</h3><p>${esc(service.desc)}</p><p class="big-stat">${esc(service.price)}</p><button class="btn ${service.id === "brand-campaign" ? "ghost" : "gold"} service-btn" type="button">${service.id === "brand-campaign" ? "Request proposal" : "Book now"}</button></div>`;
    card.querySelector(".service-btn").addEventListener("click", () => {
      if (service.id === "brand-campaign") {
        const reason = $("form")?.querySelector("[name=reason]");
        if (reason) reason.value = "Brand / Partnership";
        $("contact")?.scrollIntoView({ behavior: "smooth" });
      } else openCheckout(service, "service");
    });
    expGrid.appendChild(card);
  });

  // Events
  const eventList = $("event-list");
  if (eventList && Array.isArray(C.events)) C.events.forEach((e) => {
    const row = document.createElement("a");
    row.className = "event";
    row.href = e.ticket || "#contact";
    if (/^https?:/i.test(row.href)) { row.target = "_blank"; row.rel = "noopener noreferrer"; }
    row.innerHTML = `<div><strong>${esc(e.venue || "Live Event")}</strong><div style="color:var(--mute)">📍 ${esc(e.city)}</div></div><div>📅 ${esc(e.date)}</div>`;
    eventList.appendChild(row);
  });

  // Dynamic lookbook, useful for media and the press kit
  const world = $("world");
  if (world && Array.isArray(C.lookbook)) {
    const section = document.createElement("section");
    section.id = "lookbook";
    section.innerHTML = `<div class="wrap"><div class="sec-head stacked"><p class="kicker">📸 Visual Identity</p><h2>The FATE GAMER Lookbook</h2><p>Editorial frames, releases and visual moments for media, brands, venues and creative partners.</p></div><div class="lookbook" id="lookbook-grid"></div><div class="center-cta"><a class="btn ghost" href="#contact">Request Media Assets</a></div></div>`;
    world.parentNode.insertBefore(section, world);
    const grid = section.querySelector("#lookbook-grid");
    C.lookbook.forEach((photo) => {
      const a = document.createElement("a");
      a.href = photo.src;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.innerHTML = `<img src="${esc(photo.src)}" alt="${esc(photo.alt)}" loading="lazy">`;
      grid.appendChild(a);
    });
  }

  // Collaborations
  const collabGrid = $("collab-grid");
  if (collabGrid && Array.isArray(C.collaborations)) C.collaborations.forEach((collab) => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `<div class="pad"><small>COLLABORATION TARGET</small><h3>${esc(collab.name)}</h3><p>${esc(collab.project)}</p><a class="btn ghost" href="#contact">Start a conversation</a></div>`;
    collabGrid.appendChild(card);
  });

  // Testimonials / philosophy
  const testimonialsGrid = $("testimonials-grid");
  if (testimonialsGrid && Array.isArray(C.testimonials)) C.testimonials.forEach((t) => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `<div class="pad"><p class="quote">“${esc(t.quote)}”</p><h3>${esc(t.author)}</h3><small>${esc(t.role)}</small></div>`;
    testimonialsGrid.appendChild(card);
  });

  // Projects
  const projects = $("projects-list");
  if (projects && Array.isArray(C.projects)) C.projects.forEach((p) => {
    const el = document.createElement("article");
    el.className = "project";
    el.innerHTML = `<div class="k">${esc(p.kicker)}</div><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p><a href="${esc(p.href || "#")}" target="_blank" rel="noopener noreferrer">${esc(p.cta || "Explore")} →</a>`;
    projects.appendChild(el);
  });

  // Social links
  const follow = $("follow-row");
  if (follow && C.socials) {
    [["Instagram", C.socials.instagram], ["TikTok", C.socials.tiktok], ["YouTube", C.socials.youtube], ["Spotify", C.listen?.spotify], ["Apple Music", C.listen?.apple], ["Facebook", C.socials.facebook], ["X", C.socials.x]].forEach(([label, href]) => href && follow.appendChild(externalLink(href, label, "")));
  }

  const all = $("all-links");
  if (all && C.socials && C.listen) {
    [["Instagram — FATE GAMER", C.socials.instagram], ["Instagram — TRAP SAINT", C.socials.instagramAlt], ["TikTok", C.socials.tiktok], ["YouTube", C.socials.youtube], ["X / Twitter", C.socials.x], ["Facebook", C.socials.facebook], ["Threads", C.socials.threads], ["Spotify", C.listen.spotify], ["Apple Music", C.listen.apple], ["YouTube Music", C.listen.youtubeMusic], ["Audiomack", C.listen.audiomack], ["Boomplay", C.listen.boomplay], ["GSCN", "https://gscn-network.vercel.app"]].forEach(([label, href]) => {
      if (!href) return;
      const a = document.createElement("a"); a.href = href; a.target = "_blank"; a.rel = "noopener noreferrer"; a.innerHTML = `<span>${esc(label)}</span><span>OPEN</span>`; all.appendChild(a);
    });
  }

  // Contact form: use backend when configured, otherwise safe mail fallback.
  const form = $("form");
  if (form && form.id === "form") form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const note = $("form-note");
    if (note) note.textContent = "Sending securely…";
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const result = await response.json();
      if (result.ok && result.configured) {
        if (note) note.textContent = "Message sent. The FATE GAMER team will get back to you soon.";
        form.reset();
        return;
      }
      throw new Error(result.error || "fallback");
    } catch (_) {
      const body = encodeURIComponent(`${data.reason || "Inquiry"}\n\n${data.message || ""}\n\nFrom: ${data.name || ""} <${data.email || ""}>`);
      window.location.href = `mailto:${C.email}?subject=${encodeURIComponent("FATE GAMER — " + (data.reason || "Inquiry"))}&body=${body}`;
      if (note) note.textContent = "Opening your email app…";
    }
  });

  // Newsletter backend
  const newsletterForm = $("newsletter-form");
  if (newsletterForm) newsletterForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = new FormData(newsletterForm).get("email");
    const note = $("newsletter-note");
    if (note) note.textContent = "Joining…";
    try {
      const response = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const result = await response.json();
      if (!result.ok) throw new Error(result.error || "Unable to subscribe");
      if (note) note.textContent = result.configured ? "You're on the list. Welcome to the movement." : "You're almost there. Newsletter delivery will be activated shortly.";
      newsletterForm.reset();
    } catch (error) {
      if (note) note.textContent = error.message || "Please try again.";
    }
  });

  // Press kit actions without fake download URLs.
  const pressPhotos = $("press-photos");
  if (pressPhotos) pressPhotos.addEventListener("click", (e) => { e.preventDefault(); $("lookbook")?.scrollIntoView({ behavior: "smooth" }); });
  const pressBio = $("press-bio");
  if (pressBio) pressBio.addEventListener("click", (e) => {
    e.preventDefault();
    const bio = `FATE GAMER\n\n${C.tagline}\n${C.line}\n\n${C.origin}\n\nFrom 33, Hola, Kenya, FATE GAMER is building an Afro-fusion artist identity around music, culture, discipline and creative innovation.`;
    const blob = new Blob([bio], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "FATE-GAMER-Artist-Bio.txt"; a.click(); URL.revokeObjectURL(url);
  });
  const pressStats = $("press-stats");
  if (pressStats) pressStats.addEventListener("click", (e) => { e.preventDefault(); $("analytics")?.scrollIntoView({ behavior: "smooth" }); });

  // Payment verification after Paystack redirects back to the site.
  const params = new URLSearchParams(window.location.search);
  const paymentRef = params.get("reference");
  if (params.get("payment") === "verify" && paymentRef) {
    fetch(`/api/verify?reference=${encodeURIComponent(paymentRef)}`)
      .then((r) => r.json())
      .then((result) => {
        const toast = document.createElement("div");
        toast.className = "fg-toast";
        toast.textContent = result.ok && result.status === "success" ? "Payment confirmed. Thank you — the FATE GAMER team will contact you with the next step." : "Payment status is still being confirmed. Please keep your reference: " + paymentRef;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 9000);
        history.replaceState({}, document.title, window.location.pathname + window.location.hash);
      })
      .catch(() => {});
  }

  // Image fallback
  document.querySelectorAll("img").forEach((img) => img.addEventListener("error", () => { img.style.opacity = ".25"; }));

  // Mobile menu
  const menu = $("menu");
  const burger = $("burger");
  if (menu && burger) {
    burger.setAttribute("aria-expanded", "false");
    burger.addEventListener("click", () => {
      const open = menu.style.display === "flex";
      menu.style.display = open ? "none" : "flex";
      burger.setAttribute("aria-expanded", String(!open));
    });
    menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => { menu.style.display = "none"; burger.setAttribute("aria-expanded", "false"); }));
  }
})();
