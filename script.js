const music = document.getElementById("bg-music");

/* 🔐 CONTROLLO PIN */
function checkPin() {
  const pin = document.getElementById("pin").value;

  if (pin === "2405") {

    // nasconde lock screen
    document.getElementById("lock-screen").style.display = "none";

    // mostra contenuto
    document.getElementById("content").style.display = "block";

    document.body.style.overflow = "auto";

    // 🎵 avvia musica
    startMusic();

  } else {
    document.getElementById("error").innerText = "Codice errato ❤️";
  }
}

/* 🎵 AUDIO SYSTEM (GitHub Pages safe) */
function startMusic() {
  if (!music) return;

  music.loop = true;
  music.volume = 0.6;

  // reset per sicurezza
  music.pause();
  music.currentTime = 0;

  const playPromise = music.play();

  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        console.log("🎵 musica partita");
      })
      .catch(() => {

        // fallback definitivo browser (iOS/Chrome policy)
        const unlock = () => {
          music.play();
          document.removeEventListener("click", unlock);
        };

        document.addEventListener("click", unlock);
      });
  }
}

/* 👁️ SCROLL CINEMATICO */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
}, {
  threshold: 0.3
});

document.querySelectorAll(".scene").forEach(el => {
  observer.observe(el);
});
