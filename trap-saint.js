(function () {
  "use strict";

  const tracks = [
    { title: "TRAP SAINT", meta: "Identity / Sound", text: "A movement built around faith, focus, discipline, consistency and purpose." },
    { title: "SAINT MODE", meta: "Coming Soon", text: "The sound of choosing purpose when nobody is watching." },
    { title: "NO EXCUSES", meta: "Coming Soon", text: "Pressure becomes fuel. Setbacks become chapters. Keep moving." }
  ];

  const root = document.getElementById("trap-tracks");
  if (root) {
    tracks.forEach((track, index) => {
      const card = document.createElement("article");
      card.className = "trap-track";
      card.innerHTML = `<span class="trap-number">0${index + 1}</span><div><small>${track.meta}</small><h3>${track.title}</h3><p>${track.text}</p></div>`;
      root.appendChild(card);
    });
  }

  document.querySelectorAll("[data-trap-contact]").forEach((button) => {
    button.addEventListener("click", () => {
      const reason = document.querySelector('#form [name="reason"]');
      const message = document.querySelector('#form [name="message"]');
      if (reason) reason.value = "Collaboration / Feature";
      if (message) message.value = "I want to work with TRAP SAINT. Here is the idea / opportunity:\n\n";
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    });
  });
})();
