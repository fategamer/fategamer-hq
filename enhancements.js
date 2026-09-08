(function () {
  "use strict";

  const C = window.FG || {};
  const $ = (id) => document.getElementById(id);
  const form = $("form");

  function setInquiry(reason, message) {
    if (!form) return;
    const reasonField = form.querySelector('[name="reason"]');
    const messageField = form.querySelector('[name="message"]');
    if (reasonField) reasonField.value = reason;
    if (messageField) messageField.value = message;
    $("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => form.querySelector('[name="name"]')?.focus(), 500);
  }

  // Make every CTA that points at #contact context-aware.
  document.addEventListener("click", (event) => {
    const target = event.target.closest("a[href='#contact'], [data-trap-contact]");
    if (!target) return;
    const section = target.closest("section")?.id || "website";
    if (target.hasAttribute("data-trap-contact") || section === "trapsaint") {
      event.preventDefault();
      setInquiry("TRAP SAINT / Collaboration", "I want to discuss a TRAP SAINT collaboration. Concept: ");
      return;
    }
    if (section === "events") {
      event.preventDefault();
      setInquiry("Booking / Performance", "I want to discuss hosting FATE GAMER. City/venue: ; Date: ; Event type: ; Audience: ; Budget range: ");
    }
  });

  // Add a compact operational layer to the ecosystem sections.
  const additions = {
    collabs: {
      title: "Collaboration Desk",
      text: "For artists, producers, brands, venues and creative teams. Bring the concept, timeline and commercial scope. Every serious proposal starts with a clear brief.",
      cta: "Open collaboration brief",
      reason: "Collaboration / Feature"
    },
    members: {
      title: "How membership works",
      text: "Choose a tier, submit your request, then receive the current payment and access instructions. Membership benefits are delivered according to the active tier and availability.",
      cta: "Ask about membership",
      reason: "Membership / Community"
    },
    experiences: {
      title: "Premium booking desk",
      text: "Fixed-price experiences begin with a secure checkout. Project scope, availability and delivery details are confirmed before fulfillment.",
      cta: "Discuss an experience",
      reason: "VIP Experience"
    },
    world: {
      title: "Build beyond the stage",
      text: "FATE GAMER is designed as an ecosystem: music creates attention, TRAP SAINT creates culture, GSCN creates knowledge, and REAL FORGE creates new production possibilities.",
      cta: "Start a project",
      reason: "Creative Project"
    }
  };

  Object.entries(additions).forEach(([sectionId, item]) => {
    const section = $(sectionId);
    const wrap = section?.querySelector(".wrap");
    if (!wrap || wrap.querySelector("[data-enhancement]") || sectionId === "world") return;
    const box = document.createElement("div");
    box.dataset.enhancement = "1";
    box.className = "fg-enhancement card";
    box.innerHTML = `<div class="pad"><p class="kicker">FATE GAMER DESK</p><h3>${item.title}</h3><p>${item.text}</p><button class="btn ghost" type="button">${item.cta}</button></div>`;
    box.querySelector("button").addEventListener("click", () => setInquiry(item.reason, `I want to discuss: ${item.title}.\n\nProject details: `));
    wrap.appendChild(box);
  });

  // TRAP SAINT operating pillars.
  const trapTracks = $("trap-tracks");
  if (trapTracks && !trapTracks.dataset.enhanced) {
    trapTracks.dataset.enhanced = "1";
    const cards = [
      ["THE CODE", "Five principles: Faith. Focus. Discipline. Consistency. Purpose."],
      ["THE SOUND", "Hard, intentional and cinematic. A space for records that carry pressure, ambition and truth."],
      ["THE COMMUNITY", "A culture layer for people building through uncertainty — creators, dreamers and disciplined outsiders."],
      ["THE NEXT MOVE", "Content, conversations, releases, live activations and collaborations built around the TRAP SAINT identity."]
    ];
    trapTracks.innerHTML = cards.map(([title, text]) => `<article class="card"><div class="pad"><small>TRAP SAINT</small><h3>${title}</h3><p>${text}</p></div></article>`).join("");
  }

  // Correct the analytics presentation so static figures are not presented as live API data.
  const analytics = $("analytics");
  if (analytics) {
    const heading = analytics.querySelector("h2");
    const intro = analytics.querySelector(".sec-head p:last-child");
    if (heading) heading.textContent = "Growth Snapshot";
    if (intro) intro.textContent = "A public snapshot of the figures currently published on this site. Verified platform data can be connected later through official APIs.";
  }

  // Lightweight success/error toast shared by future interactions.
  const toast = document.createElement("div");
  toast.className = "fg-toast";
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");
  document.body.appendChild(toast);
  let toastTimer;
  window.FGToast = (message) => {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
  };

  // External platform links open safely and provide a consistent interaction cue.
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[target='_blank']");
    if (!link || !link.href || link.href.startsWith("javascript:")) return;
    if (window.FGToast) window.FGToast("Opening in a new tab…");
  });
})();
