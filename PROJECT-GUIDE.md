# FATE GAMER HQ — COMPLETE PROJECT GUIDE

## 🎯 PROJECT OVERVIEW

**Website:** fategamer-hq (Vercel deployment ready)  
**Domain:** fategamer.com (to be connected)  
**Status:** Live with 6 released songs, gallery, projects, contact form  
**Tech:** HTML/CSS/JavaScript (Vanilla, no frameworks)

---

## 📁 FILE STRUCTURE & PURPOSE

```
fategamer-hq/
├── index.html          → Main HTML structure (all sections)
├── styles.css          → Dark theme styling (gold accents)
├── content.js          → ⭐ DATA FILE (Edit here for content)
├── app.js              → JavaScript rendering logic
├── vercel.json         → Vercel deployment config
├── README.md           → Launch instructions
├── PROJECT-GUIDE.md    → This file (development reference)
└── photos/             → Folder for .webp images
```

---

## 🔑 KEY FILE: content.js

**This is where ALL content lives.** Edit here to update the website.

### Structure:
```javascript
window.FG = {
  // Basic Info
  name: "FATE GAMER"
  tagline: "From 33, Hola, Kenya. To wherever the music takes me."
  email: "bookings@fategamer.com"

  // Social Media Links
  socials: {
    instagram: "https://www.instagram.com/fate_.gamer/",
    instagramAlt: "https://www.instagram.com/trapsaint/",
    tiktok: "https://www.tiktok.com/@fate_gamer",
    youtube: "https://www.youtube.com/@fategamer",
    x: "https://x.com/fate_gamerTM",
    facebook: "https://www.facebook.com/fategamer",
    threads: "https://www.threads.net/@fate_.gamer",
    linkedin: "https://www.linkedin.com/search/results/all/?keywords=Fate%20Gamer",
    github: "https://github.com/fategamer",
    whop: "https://whop.com/fate-gamer"
  }

  // Music Streaming Links
  listen: {
    spotify: "https://open.spotify.com/search/FATEGAMER",
    apple: "https://music.apple.com/search?term=FATEGAMER",
    youtubeMusic: "https://music.youtube.com/search?q=FATEGAMER",
    audiomack: "https://audiomack.com/search?q=FATEGAMER",
    boomplay: "https://www.boomplay.com/search/FATEGAMER"
  }

  // Featured Release (Main highlight)
  featured: {
    title: "MAREKA",
    type: "Single · out now",
    blurb: "Loyalty Over Everything.",
    cover: "https://assets-2-prod.whop.com/..."
  }

  // Released Songs (6 tracks currently)
  releases: [
    { title, meta, note, cover, href },
    ...
  ]

  // Coming Soon Tracks (Nov/Dec 2026)
  vault: [
    { title, meta, note, cover },
    ...
  ]

  // Live Events (CURRENTLY EMPTY - add here)
  events: []

  // Gallery/Lookbook (11 images)
  lookbook: [
    { src, alt },
    ...
  ]

  // 3 Main Projects
  projects: [
    { kicker, title, text, href, cta },
    { kicker: "Culture", title: "TRAP SAINT", ... },
    { kicker: "Knowledge", title: "GSCN", ... },
    { kicker: "Studio", title: "REAL FORGE", ... }
  ]
}
```

---

## 🎨 CURRENT WEBSITE SECTIONS

| Section | HTML ID | Status | Edit Location |
|---------|---------|--------|----------------|
| Navigation | nav | ✅ Live | index.html |
| Hero Banner | #top | ✅ Live | index.html, app.js |
| Music (Releases) | #music | ✅ Live | content.js |
| Watch (Gallery) | #videos | ✅ Live | content.js |
| Live (Events) | #events | ⚠️ Empty | content.js |
| About | #about | ✅ Live | index.html |
| World (Projects) | #world | ✅ Live | content.js |
| Contact | #contact | ✅ Live | content.js, app.js |

---

## 🚀 HOW TO ADD/EDIT CONTENT

### Pattern 1: Simple Data Update (Fastest)

**To add an event:**
1. Open `content.js`
2. Find `events: []`
3. Add object:
```javascript
events: [
  {
    title: "Concert Name",
    venue: "Venue Name",
    city: "City",
    date: "Sep 15, 2026",
    link: "https://ticketlink.com"
  }
]
```
4. Push to main → Vercel auto-deploys

### Pattern 2: Add New Section

**To add a "Covers" section:**

1. **Add data in content.js:**
```javascript
covers: [
  {
    title: "Song Name",
    original_artist: "Artist Name",
    cover: "https://image-url",
    instagram: "https://instagram.com/...",
    youtube: "https://youtube.com/...",
    meta: "Cover · 2026"
  }
]
```

2. **Add HTML in index.html** (after Music, before Watch):
```html
<section id="covers">
  <div class="wrap">
    <div class="sec-head stacked">
      <p class="kicker">Covers</p>
      <h2>Reimagined Classics</h2>
    </div>
    <div class="cards" id="covers-list"></div>
  </div>
</section>
```

3. **Add render logic in app.js** (before closing bracket):
```javascript
const covers = document.getElementById("covers-list");
(C.covers || []).forEach((c) => {
  const a = document.createElement("a");
  a.className = "card";
  a.href = c.youtube || c.instagram;
  a.target = "_blank";
  a.innerHTML = `
    <img src="${c.cover}" alt="${c.title}" />
    <div class="pad">
      <small>${c.original_artist}</small>
      <h3>${c.title}</h3>
    </div>
  `;
  covers.appendChild(a);
});
```

4. **No CSS needed** (reuses .cards class)

5. **Push to main** → Done!

---

## 📊 RECENT COMMITS (Last Work Done)

| Date | Commit | What Changed |
|------|--------|--------------|
| Sep 8, 09:39 | Fix all URLs | Completed all truncated links in releases |
| Sep 8, 09:15 | Sync live HQ | Split hero, store links, OG tags |
| Sep 8, 06:43 | CDN images | Hero and covers use public CDN |
| Sep 8, 06:41 | Public CDN | Covers load on Vercel |
| Sep 8, 05:07 | YouTube fix | Music search corrected |
| Sep 8, 05:06 | Featured song | Set MAREKA as featured release |

---

## 🛠️ DEVELOPMENT WORKFLOW

### To make changes:

1. **Clone or edit in GitHub**
```bash
git clone https://github.com/fategamer/fategamer-hq.git
cd fategamer-hq
```

2. **Make changes to any file**
   - `content.js` (data/content)
   - `index.html` (structure)
   - `styles.css` (styling)
   - `app.js` (logic)

3. **Test locally**
   - Open `index.html` in browser
   - Check console for errors (F12)

4. **Push to main**
```bash
git add .
git commit -m "Description of changes"
git push origin main
```

5. **Vercel auto-deploys** (2-5 minutes)

### Check deployment:
- Current: https://fategamer-hq.vercel.app
- When ready: fategamer.com (once domain connected)

---

## 🎵 MUSIC CONTENT REFERENCE

### Released (6 Songs - Currently Live)
- MAREKA — Single · Loyalty Over Everything ✅
- DOPE — Single · Papitoo ft. FATEGAMER ✅
- MAALIM — Official Audio · Godown Music Studios ✅
- KIZAZI JEURI — EP · Ego Check · Nyota · Dope ✅
- EGO CHECK — Single · Kizazi Jeuri ✅
- NYOTA — Single · Kizazi Jeuri ✅

### Unreleased (Coming Nov/Dec 2026)
- NOT THEM — Sio Lazima Wao
- NATAKA — feat. Lonepapi & Mussk
- LIFE OF A GAMER — Album · 17 songs. 17 stories. 1 journey.

### Covers (To be added)
- List your covers here when ready
- Add to new `covers` array in content.js

---

## 🎯 NEXT FEATURES TO BUILD

### Priority 1: Covers Section (3-4 hours)
- [ ] Create covers array in content.js
- [ ] Add HTML section in index.html
- [ ] Add render logic in app.js
- [ ] Link to Instagram/YouTube

### Priority 2: Events System (2-3 hours)
- [ ] Fill events array in content.js
- [ ] Add date formatting
- [ ] Link to ticket platforms
- [ ] Show past events archive

### Priority 3: Booking System (3-4 hours)
- [ ] Add email backend (Formspree/Firebase)
- [ ] Create booking form
- [ ] Add date/venue fields
- [ ] Send to bookings email

### Priority 4: Domain Connection (30 mins)
- [ ] Buy fategamer.com
- [ ] Add to Vercel settings
- [ ] Update DNS records
- [ ] Test SSL

---

## 🎨 STYLING GUIDE

### Colors (in styles.css)
```css
--bg: #070706;           /* Dark background */
--gold: #d4b46a;         /* Primary accent */
--gold-2: #f0e2b8;       /* Light gold */
--ink: #f6f1e6;          /* Text color */
--mute: #9a917f;         /* Muted text */
--line: rgba(232,213,163,0.16); /* Border color */
```

### Reusable Classes
- `.btn` — Button styling
- `.btn.gold` — Gold button
- `.btn.ghost` — Ghost button
- `.card` — Card grid item
- `.kicker` — Section label
- `.sec-head` — Section header
- `.wrap` — Content wrapper (max 1180px)

### Responsive
- Mobile-first
- Breakpoint: `@media (max-width: 900px)`
- Grid layouts adjust automatically

---

## 🔐 Important Links

- **Repo:** https://github.com/fategamer/fategamer-hq
- **Live Site:** https://fategamer-hq.vercel.app
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Instagram:** @fate_.gamer
- **YouTube:** @fategamerTV
- **Spotify:** https://open.spotify.com/search/FATEGAMER

---

## ⚡ QUICK COMMANDS

### View live site
```
https://fategamer-hq.vercel.app
```

### View Git history
```
https://github.com/fategamer/fategamer-hq/commits/main
```

### Edit directly on GitHub
- Go to file → Click pencil icon → Edit → Commit

### Deploy immediately
- Push to main branch → Vercel auto-deploys

---

## 🆘 TROUBLESHOOTING

### Images not showing?
- Check URL is accessible
- Use public CDN URLs (not local paths)
- Add fallback image handling

### Changes not live?
- Wait 2-5 minutes for Vercel to deploy
- Clear browser cache (Ctrl+Shift+Del)
- Check Vercel deployment status

### JavaScript errors?
- Open browser console (F12)
- Check for syntax errors in content.js
- Verify all objects have closing braces

### CSS not applying?
- Clear browser cache
- Check class names match HTML
- Verify CSS is linked in index.html

---

## 📝 CONTENT EDITING CHECKLIST

When adding new content, verify:
- [ ] All URLs are complete (no truncated links)
- [ ] Image URLs are accessible
- [ ] Text is concise and on-brand
- [ ] Links open in new tab (target="_blank")
- [ ] No broken references
- [ ] Commas between array items
- [ ] No missing quotes or braces

---

## 🎬 TO GIVE TO DESKTOP COPILOT

**Copy this entire file to your desktop Copilot with:**

"Use this guide to build features for fategamer-hq. Follow the patterns shown. Edit content.js for data, index.html for structure, and app.js for rendering. After changes, push to main and Vercel will deploy automatically."

---

**Last Updated:** Sep 8, 2026  
**By:** fategamer + Copilot  
**Status:** Ready for desktop development
