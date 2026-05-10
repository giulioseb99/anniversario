const music = document.getElementById("bg-music");

/* 📸 IMMAGINI */
const images = [
  "assets/images/1.jpg",
  "assets/images/2.jpg",
  "assets/images/3.jpg",
  "assets/images/4.jpg",
  "assets/images/5.jpg",
  "assets/images/6.jpg",
  "assets/images/7.jpg",
  "assets/images/8.jpg",
  "assets/images/9.jpg",
  "assets/images/10.jpg",
  "assets/images/11.jpg"
];

let currentImg = 0;

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

/* 🎵 AUDIO */
function startMusic() {
  if (!music) return;

  music.loop = true;
  music.volume = 0.6;
  music.load();
  music.pause();
  music.currentTime = 0;

  setTimeout(() => {
    music.play().catch(() => {
      document.addEventListener("click", () => {
        music.play().catch(() => {});
      }, { once: true });
    });
  }, 500);
}

/* 📸 GALLERY */
const imgEl = document.getElementById("gallery-img");

function showNextImage() {
  if (!imgEl) return;

  if (currentImg < images.length) {
    imgEl.src = images[currentImg];
    currentImg++;
  }
}

const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      showNextImage();
    }
  });
}, { threshold: 0.6 });

document.querySelectorAll(".image-scene").forEach(el => {
  imageObserver.observe(el);
});

/* 🎬 SCROLL ANIMATIONS */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll(".scene").forEach(el => {
  observer.observe(el);
});
