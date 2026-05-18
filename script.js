const music = document.getElementById("bg-music");

/* 📸 IMMAGINI */
const images = [
  "assets/images/belli.JPEG",
  "assets/images/belli2.JPEG",
"assets/images/agosto25.JPEG",
     "assets/images/anelli1.JPEG",
      "assets/images/baffi.JPEG",
     "assets/images/cappellipaglia.JPEG",
       "assets/images/cenatenerife.JPEG",
      "assets/images/compleanno1.JPEG",
       "assets/images/cremabarba.JPEG",
      "assets/images/giappone2.JPEG",
      "assets/images/insieme1.JPEG",
    "assets/images/manciano.JPEG",
       "assets/images/occhiali.JPEG",
      "assets/images/offroadtenerife.JPEG",
       "assets/images/penny1.JPEG",
      "assets/images/raybaninsieme1.JPEG",
       "assets/images/santasevera.JPEG",
       "assets/images/teidetenerife.JPEG",
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
}, {
  threshold: 0.05,
  rootMargin: "0px 0px -100px 0px"
});

document.querySelectorAll(".scene").forEach(el => {
  observer.observe(el);
});


/* ========================= */
/* 🎠 CAROSELLO 3D - FLUIDO (Catalogo deluxe) */
/* Migliorato:
   - layout centrato con anteprime proporzionate (niente deformazioni)
   - trascinamento fluido con momentum
   - loop visivo continuo
   - funzioni compatibili mouse/touch/pointer
*/
/* ========================= */

const carousel = document.getElementById("carousel");

if (carousel) {
  const items = Array.from(carousel.querySelectorAll("img"));
  const count = items.length;
  if (count > 0) {
    // container styles (inline to avoid requiring CSS edits)
    carousel.style.position = 'relative';
    carousel.style.overflow = 'visible';
    carousel.style.touchAction = 'pan-y'; // allow vertical scroll but keep horizontal gestures for carousel

    // per-item base styles
    items.forEach(img => {
      img.style.position = 'absolute';
      img.style.left = '50%';
      img.style.top = '50%';
      img.style.transformOrigin = '50% 50%';
      img.style.willChange = 'transform, opacity';
      img.style.transition = 'transform 0.5s cubic-bezier(.2,.8,.2,1), opacity 0.5s';
      img.style.pointerEvents = 'none'; // allow dragging without capturing images
      img.style.maxWidth = '260px';
      img.style.width = 'auto';
      img.style.height = 'auto';
    });

    // state
    let position = 0; // floating center index (0..count)
    let dragging = false;
    let pointerId = null;
    let lastX = 0;
    let velocity = 0;
    let lastMoveTime = 0;
    let momentumFrame = null;

    const friction = 0.92; // momentum decay (lower => faster stop)
    const sensitivity = 1; // drag sensitivity

    // compute spacing based on item size (fallback to 300)
    function computeSpacing() {
      const rect = items[0].getBoundingClientRect();
      return Math.max(240, rect.width * 0.9);
    }

    function mod(a, m) { return ((a % m) + m) % m; }

    // place items around the center using modular arithmetic so they visually loop
    function applyPositions() {
      const spacing = computeSpacing();
      const centerX = carousel.clientWidth / 2;
      const centerY = carousel.clientHeight / 2;

      items.forEach((img, i) => {
        // shortest signed distance in index space (wrap-around)
        let raw = i - position;
        if (raw > count / 2) raw -= count;
        if (raw < -count / 2) raw += count;

        // visual placement
        const x = raw * spacing;
        const absRaw = Math.abs(raw);

        // scaling and depth
        const scale = Math.max(0.55, 1 - absRaw * 0.14);
        const z = Math.max(-300, -Math.abs(raw) * 120);
        const rotateY = raw * 10; // slight rotation for 3D feel

        // opacity fades out for far items
        const opacity = absRaw > 3.5 ? 0 : 1 - (absRaw / 5);

        // z-index so center is on top
        const zIndex = Math.round(1000 - absRaw * 10);

        img.style.zIndex = zIndex;
        img.style.opacity = opacity;
        img.style.transform = `translate3d(${x}px, -50%, ${z}px) scale(${scale}) rotateY(${rotateY}deg)`;
      });
    }

    // animation loop for momentum
    function startMomentum() {
      cancelMomentum();
      function step() {
        if (Math.abs(velocity) > 0.0001) {
          position += velocity;
          // keep position wrapped within [0,count) to avoid numeric drift
          position = mod(position, count);
          applyPositions();
          velocity *= friction;
          momentumFrame = requestAnimationFrame(step);
        } else {
          cancelMomentum();
          // snap to nearest integer for neat resting place (optional)
          const target = Math.round(position);
          // animate to exact center
          const start = position;
          const diff = (target - start);
          if (Math.abs(diff) > 0.001) {
            const duration = 400;
            const t0 = performance.now();
            function snapFrame(now) {
              const p = Math.min(1, (now - t0) / duration);
              // easeOutCubic
              const ease = 1 - Math.pow(1 - p, 3);
              position = start + diff * ease;
              applyPositions();
              if (p < 1) requestAnimationFrame(snapFrame);
            }
            requestAnimationFrame(snapFrame);
          }
        }
      }
      momentumFrame = requestAnimationFrame(step);
    }

    function cancelMomentum() {
      if (momentumFrame) {
        cancelAnimationFrame(momentumFrame);
        momentumFrame = null;
      }
    }

    // pointer handlers
    carousel.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      dragging = true;
      pointerId = e.pointerId;
      try { e.target.setPointerCapture(pointerId); } catch (err) {}
      lastX = e.clientX;
      lastMoveTime = performance.now();
      velocity = 0;
      cancelMomentum();

      // while dragging we disable smooth transitions for immediate response
      items.forEach(img => img.style.transition = 'none');

      document.body.style.userSelect = 'none';
    });

    document.addEventListener('pointermove', (e) => {
      if (!dragging || e.pointerId !== pointerId) return;
      const now = performance.now();
      const dx = e.clientX - lastX;
      const dt = Math.max(1, now - lastMoveTime);

      const spacing = computeSpacing();
      // change in position measured in item indices
      const deltaIndex = - (dx / spacing) * sensitivity;
      position += deltaIndex;
      position = mod(position, count);
      applyPositions();

      // velocity in index units per frame (normalized to 60fps)
      velocity = (deltaIndex) / (dt / 16.6667);

      lastX = e.clientX;
      lastMoveTime = now;
    });

    function endDrag(e) {
      if (!dragging) return;
      dragging = false;
      try { if (pointerId != null) document.releasePointerCapture(pointerId); } catch (err) {}
      pointerId = null;

      document.body.style.userSelect = 'auto';

      // restore transitions for smooth settling
      items.forEach(img => img.style.transition = 'transform 0.6s cubic-bezier(.2,.8,.2,1), opacity 0.4s');

      // start momentum if significant
      if (Math.abs(velocity) > 0.002) {
        startMomentum();
      } else {
        // snap to nearest
        const target = Math.round(position);
        position = target;
        applyPositions();
      }
    }

    document.addEventListener('pointerup', endDrag);
    document.addEventListener('pointercancel', endDrag);

    // prevent page vertical scroll while actively dragging the carousel
    carousel.addEventListener('touchmove', (e) => {
      if (dragging) e.preventDefault();
    }, { passive: false });

    // blur safety
    window.addEventListener('blur', () => { if (dragging) endDrag(); });

    // initial layout
    // position center on 0 (first item) nicely
    position = 0;
    applyPositions();

    // on resize, re-apply positions to recompute spacing
    window.addEventListener('resize', () => applyPositions());
  }
}
