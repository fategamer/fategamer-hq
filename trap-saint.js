(function () {
  "use strict";

  const style = document.createElement("style");
  style.textContent = `
    .trap-saint { position: relative; overflow: hidden; background: radial-gradient(circle at 85% 20%, rgba(212,180,106,.12), transparent 34%), linear-gradient(180deg,#090806,#11100d); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
    .trap-hero { min-height: 560px; display: grid; grid-template-columns: 1.5fr .5fr; gap: 40px; align-items: center; }
    .trap-hero h2 { font-family: Cinzel,serif; font-size: clamp(4rem,12vw,9rem); line-height: .8; letter-spacing: -.06em; margin: 18px 0 26px; }
    .trap-hero h2 span { color: var(--gold); }
    .trap-lead { font-size: clamp(1.2rem,2vw,1.7rem); text-transform: uppercase; letter-spacing: .18em; color: var(--gold-2); }
    .trap-copy { max-width: 680px; color: var(--mute); margin: 18px 0 28px; font-size: 1.05rem; }
    .trap-mark { width: 250px; height: 250px; border: 1px solid var(--gold); border-radius: 50%; display: grid; place-items: center; align-content: center; justify-self: end; transform: rotate(-8deg); box-shadow: 0 0 80px rgba(212,180,106,.1); }
    .trap-mark span { font-family: Cinzel,serif; font-size: 5rem; color: var(--gold); line-height: 1; }
    .trap-mark small { letter-spacing: .35em; color: var(--mute); }
    .trap-values { display: flex; flex-wrap: wrap; gap: 10px; padding: 20px 0 36px; border-top: 1px solid var(--line); }
    .trap-values span { border: 1px solid var(--line); padding: 10px 15px; font-size: .72rem; letter-spacing: .18em; color: var(--gold-2); }
    .trap-tracks { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; padding-bottom: 70px; }
    .trap-track { position: relative; min-height: 220px; padding: 30px; background: rgba(255,255,255,.025); border: 1px solid var(--line); transition: transform .25s ease,border-color .25s ease; }
    .trap-track:hover { transform: translateY(-6px); border-color: rgba(212,180,106,.55); }
    .trap-number { font-family: Cinzel,serif; color: var(--gold); font-size: .8rem; }
    .trap-track h3 { font-family: Cinzel,serif; font-size: 1.6rem; margin: 20px 0 10px; }
    .trap-track small { color: var(--mute); text-transform: uppercase; letter-spacing: .15em; }
    .trap-track p { color: var(--mute); }
    @media (max-width: 760px) { .trap-hero { min-height: auto; padding: 80px 0 40px; grid-template-columns: 1fr; } .trap-mark { width: 170px; height: 170px; justify-self: start; } .trap-mark span { font-size: 3.5rem; } .trap-tracks { grid-template-columns: 1fr; } .trap-values { gap: 7px; } .trap-values span { font-size: .62rem; } }
  `;
  document.head.appendChild(style);

  const tracks = [
    { title: "TRAP SAINT", meta: "Identity / Sound", text: "A movement built around faith, focus, discipline, consistency and purpose." },
    { title: "SAINT MODE", meta: "Coming Soon", text: "The sound of choosing purpose when nobody is watching." },
    { title: "NO EXCUSES", meta: "Coming Soon", text: "Pressure becomes fuel. Setbacks become chapters. Keep moving." }
  ];

  const root = document.getElementById("trap-tracks");
  if (root) tracks.forEach((track, index) => {
    const card = document.createElement("article");
    card.className = "trap-track";
    card.innerHTML = `<span class="trap-number">0${index + 1}</span><div><small>${track.meta}</small><h3>${track.title}</h3><p>${track.text}</p></div>`;
    root.appendChild(card);
  });

  document.querySelectorAll("[data-trap-contact]").forEach((button) => button.addEventListener("click", () => {
    const reason = document.querySelector('#form [name="reason"]');
    const message = document.querySelector('#form [name="message"]');
    if (reason) reason.value = "Collaboration / Feature";
    if (message) message.value = "I want to work with TRAP SAINT. Here is the idea / opportunity:\n\n";
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  }));
})();
