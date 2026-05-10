const music = document.getElementById("bg-music");

/* 🔐 PIN */
function checkPin() {
  const pin = document.getElementById("pin").value;

  if (pin === "2405") {

    document.getElementById("lock-screen").style.display = "none";
    document.getElementById("content").style.display = "block";
    document.body.style.overflow = "auto";

    startMusic();

  } else {
    document.getElementById("error").innerText = "Codice errato ❤️";
  }
}

/* 🎵 MUSICA FIXATA */
function startMusic() {
  if (!music) return;

  music.loop = true;
  music.volume = 0.6;

  music.load();

  const playPromise = music.play();

  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        console.log("🎵 musica partita");
      })
      .catch(err => {
        console.log("autoplay bloccato:", err);
        music.play();
      });
  }
}

/* 👁️ SCROLL ANIMATION */
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