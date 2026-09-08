(function () {
  const C = window.FG;
  if (!C) return;

  document.getElementById("feat-title").textContent = C.featured.title;
  document.getElementById("feat-type").textContent = "FATE GAMER · " + C.featured.type;
  document.getElementById("feat-blurb").textContent = C.featured.blurb;
  document.getElementById("feat-cover").src = C.featured.cover;

  const platforms = document.getElementById("platforms");
  const listenLabels = {
    spotify: "Spotify",
    apple: "Apple Music",
    youtubeMusic: "YouTube Music",
    audiomack: "Audiomack",
    boomplay: "Boomplay"
  };
  Object.entries(C.listen).forEach(([key, href]) => {
    const a = document.createElement("a");
    a.className = "chip";
    a.href = href;
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = listenLabels[key] || key;
    platforms.appendChild(a);
  });

  const releases = document.getElementById("releases");
  C.releases.forEach((r) => {
    const a = document.createElement("a");
    a.className = "card";
    a.href = r.href;
    a.target = "_blank";
    a.rel = "noopener";
    a.innerHTML = `<img src="${r.cover}" alt="${r.title}" /><div class="pad"><small>${r.meta}</small><h3>${r.title}</h3><small>${r.note}</small></div>`;
    releases.appendChild(a);
  });

  const vault = document.getElementById("vault");
  (C.vault || []).forEach((r) => {
    const el = document.createElement("article");
    el.className = "card";
    el.innerHTML = `<img src="${r.cover}" alt="${r.title}" /><div class="pad"><small>${r.meta}</small><h3>${r.title}</h3><small>${r.note}</small></div>`;
    vault.appendChild(el);
  });

  const eventList = document.getElementById("event-list");
  if (!C.events.length) {
    eventList.innerHTML = `<div class="empty">Upcoming dates land here first. Follow FATE GAMER — you will know before the room fills.</div>`;
  } else {
    C.events.forEach((e) => {
      const row = document.createElement("a");
      row.className = "event";
      row.href = e.link || "#contact";
      row.innerHTML = `<div><strong>${e.title}</strong><div style="color:var(--mute)">📍 ${e.venue || ""} ${e.city ? "· " + e.city : ""}</div></div><div>📅 ${e.date}</div>`;
      eventList.appendChild(row);
    });
  }

  const gallery = document.getElementById("gallery");
  (C.lookbook || []).forEach((v) => {
    const a = document.createElement("a");
    a.href = C.socials.instagram;
    a.target = "_blank";
    a.rel = "noopener";
    a.title = v.alt;
    a.innerHTML = `<img src="${v.src}" alt="${v.alt}" />`;
    gallery.appendChild(a);
  });

  document.getElementById("yt-cta").href = C.socials.youtube;

  const projects = document.getElementById("projects-list");
  C.projects.forEach((p) => {
    const el = document.createElement("article");
    el.className = "project";
    el.innerHTML = `<div class="k">${p.kicker}</div><h3>${p.title}</h3><p>${p.text}</p><a href="${p.href}" target="_blank" rel="noopener">${p.cta} →</a>`;
    projects.appendChild(el);
  });

  const follow = document.getElementById("follow-row");
  const followItems = [
    ["Instagram", C.socials.instagram],
    ["TikTok", C.socials.tiktok],
    ["YouTube", C.socials.youtube],
    ["Spotify", C.listen.spotify],
    ["Apple Music", C.listen.apple],
    ["Facebook", C.socials.facebook],
    ["X", C.socials.x],
    ["LinkedIn", C.socials.linkedin]
  ];
  followItems.forEach(([label, href]) => {
    const a = document.createElement("a");
    a.href = href;
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = label;
    follow.appendChild(a);
  });

  const all = document.getElementById("all-links");
  const directory = [
    ["Instagram — FATE GAMER", C.socials.instagram],
    ["Instagram — TRAP SAINT", C.socials.instagramAlt],
    ["TikTok", C.socials.tiktok],
    ["TikTok — TRAP SAINT", C.socials.tiktokAlt],
    ["YouTube", C.socials.youtube],
    ["X / Twitter", C.socials.x],
    ["Facebook", C.socials.facebook],
    ["Threads", C.socials.threads],
    ["Spotify", C.listen.spotify],
    ["Apple Music", C.listen.apple],
    ["YouTube Music", C.listen.youtubeMusic],
    ["Audiomack", C.listen.audiomack],
    ["Boomplay", C.listen.boomplay],
    ["LinkedIn", C.socials.linkedin],
    ["GSCN", "https://gscn-network.vercel.app"],
    ["GitHub", C.socials.github]
  ];
  directory.forEach(([label, href]) => {
    const a = document.createElement("a");
    a.href = href;
    a.target = "_blank";
    a.rel = "noopener";
    a.innerHTML = `<span>${label}</span><span>OPEN</span>`;
    all.appendChild(a);
  });

  document.getElementById("form").addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    const body = encodeURIComponent(`${data.reason}\n\n${data.message}\n\nFrom: ${data.name} <${data.email}>`);
    window.location.href = `mailto:${C.email}?subject=${encodeURIComponent("FATE GAMER — " + data.reason)}&body=${body}`;
    document.getElementById("form-note").textContent = "Opening your mail app…";
  });

  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("error", () => {
      img.style.visibility = "hidden";
    });
  });

  const menu = document.getElementById("menu");
  document.getElementById("burger").addEventListener("click", () => {
    menu.style.display = menu.style.display === "flex" ? "none" : "flex";
  });
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => (menu.style.display = "none")));
})();
