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


/* ========================= */
/* 🎠 CAROSELLO 3D - FIXED */
/*  - smooth dragging while pointer pressed
    - touch + mouse support via Pointer Events
    - momentum after release for natural feel
*/
/* ========================= */

const carousel = document.getElementById("carousel");

if (carousel) {
  const items = carousel.querySelectorAll("img");
  if (items.length > 0) {
    const angle = 360 / items.length;
    let currentAngle = 0;

    // arrange items in circle (match CSS perspective/translateZ)
    items.forEach((img, i) => {
      img.style.transform = `rotateY(${i * angle}deg) translateZ(400px)`;
    });

    // pointer dragging state
    let dragging = false;
    let pointerId = null;
    let lastX = 0;
    let velocity = 0;
    let lastMoveTime = 0;
    let momentumFrame = null;

    const sensitivity = 0.12; // tweak rotation sensitivity
    const friction = 0.95; // momentum decay (0.9-0.99)

    function applyTransform() {
      carousel.style.transform = `rotateY(${currentAngle}deg)`;
    }

    function startMomentumLoop() {
      cancelMomentum();
      momentumFrame = requestAnimationFrame(function step() {
        // apply velocity
        if (Math.abs(velocity) > 0.001) {
          currentAngle += velocity;
          applyTransform();
          velocity *= friction;
          momentumFrame = requestAnimationFrame(step);
        } else {
          cancelMomentum();
        }
      });
    }

    function cancelMomentum() {
      if (momentumFrame) {
        cancelAnimationFrame(momentumFrame);
        momentumFrame = null;
      }
    }

    // set initial cursor
    carousel.style.cursor = 'grab';

    // pointerdown
    carousel.addEventListener('pointerdown', (e) => {
      // only left button for mouse
      if (e.pointerType === 'mouse' && e.button !== 0) return;

      dragging = true;
      pointerId = e.pointerId;
      try { carousel.setPointerCapture(pointerId); } catch (err) {}

      lastX = e.clientX;
      lastMoveTime = performance.now();
      velocity = 0;
      cancelMomentum();

      carousel.style.cursor = 'grabbing';
      carousel.style.transition = 'none'; // disable CSS transition while dragging

      // avoid selecting images/text while dragging
      document.body.style.userSelect = 'none';
      e.preventDefault();
    });

    // pointermove on document so it continues even when pointer leaves carousel
    document.addEventListener('pointermove', (e) => {
      if (!dragging || e.pointerId !== pointerId) return;

      const now = performance.now();
      const deltaX = e.clientX - lastX;
      const dt = Math.max(1, now - lastMoveTime);

      // update angle
      const deltaAngle = deltaX * sensitivity;
      currentAngle += deltaAngle;
      applyTransform();

      // compute velocity in angle-per-frame units
      velocity = deltaAngle / (dt / 16.6667); // normalized to ~60fps

      lastX = e.clientX;
      lastMoveTime = now;
    });

    // pointerup / cancel
    function endDrag(e) {
      if (!dragging || (e && e.pointerId && e.pointerId !== pointerId)) return;

      dragging = false;
      try { if (pointerId != null) carousel.releasePointerCapture(pointerId); } catch (err) {}
      pointerId = null;

      // restore cursor and CSS transition for natural easing
      carousel.style.cursor = 'grab';
      carousel.style.transition = 'transform 1s';

      document.body.style.userSelect = 'auto';

      // start momentum if velocity significant
      if (Math.abs(velocity) > 0.02) {
        startMomentumLoop();
      } else {
        velocity = 0;
      }
    }

    document.addEventListener('pointerup', endDrag);
    document.addEventListener('pointercancel', endDrag);

    // Touch: prevent page scroll while touching carousel so drag feels immediate
    carousel.addEventListener('touchmove', (e) => {
      if (dragging) e.preventDefault();
    }, { passive: false });

    // ensure keyboard/other interactions won't break things
    window.addEventListener('blur', () => {
      if (dragging) endDrag({});
    });

  }
}
