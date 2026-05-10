const music = document.getElementById("bg-music");

/* 📸 IMMAGINI */
const images = [
  "assets/images/belli.JPEG",
  "assets/images/belli2.JPEG",
  "assets/images/boccaspalancata.JPEG",
  "assets/images/capodanno.JPEG",
  "assets/images/dorme.JPEG",
  "assets/images/help.JPEG",
  "assets/images/laurealavi.JPEG",
  "assets/images/letto1.JPEG",
  "assets/images/peluche.JPEG",
  "assets/images/sorrisi1.JPEG",
  "assets/images/sushi.JPEG"
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

const carousel = document.getElementById("carousel");

if (carousel) {

  const items = carousel.querySelectorAll("img");

  const angle = 360 / items.length;
  let currentAngle = 0;

  items.forEach((img, i) => {
    img.style.transform = `rotateY(${i * angle}deg) translateZ(400px)`;
  });

  let startX = 0;
  let dragging = false;

  function rotateCarousel(delta) {
    currentAngle += delta;
    carousel.style.transform = `rotateY(${currentAngle}deg)`;
  }

  carousel.addEventListener("mousedown", (e) => {
    dragging = true;
    startX = e.clientX;
  });

  document.addEventListener("mouseup", () => dragging = false);

  document.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    const delta = (e.clientX - startX) * 0.3;
    rotateCarousel(delta);
    startX = e.clientX;
  });

  carousel.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });

  carousel.addEventListener("touchmove", (e) => {
    const delta = (e.touches[0].clientX - startX) * 0.3;
    rotateCarousel(delta);
    startX = e.touches[0].clientX;
  });
}
