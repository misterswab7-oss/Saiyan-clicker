
class SoundManager {
  constructor(settings) {
    this.settings = settings;
    this.ctx = null;
  }

  play(freq, duration) {
    if (!this.settings.sound) return;
    try {
      this.ctx = this.ctx || new (window.AudioContext || window.webkitAudioContext)();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.frequency.value = freq;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      osc.connect(gain).connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      
    }
  }
}

class SaveManager {
  constructor(key) {
    this.key = key;
  }

  save(data) {
    localStorage.setItem(this.key, JSON.stringify(data));
  }

  load() {
    const raw = localStorage.getItem(this.key);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.warn("Kon opgeslagen spel niet laden:", e);
      return null;
    }
  }

  clear() {
    localStorage.removeItem(this.key);
  }
}

class StatsView {
  constructor() {
    this.kiValue = document.getElementById("ki-value");
    this.level = document.getElementById("stat-level");
    this.transformation = document.getElementById("stat-transformation");
    this.kpc = document.getElementById("stat-kpc");
    this.kps = document.getElementById("stat-kps");
    this.lifetime = document.getElementById("stat-lifetime");
    this.barFill = document.getElementById("level-bar-fill");
    this.barLabel = document.getElementById("level-bar-label");
  }

  render(player, transformation, progress) {
    this.kiValue.textContent = Formatter.number(player.ki);
    this.kpc.textContent = Formatter.number(player.kiPerClick);
    this.kps.textContent = Formatter.number(player.kiPerSecond);
    this.lifetime.textContent = Formatter.number(player.lifetimeKi);
    this.transformation.textContent = transformation.name;
    this.level.textContent = progress.level;

    this.barFill.style.width = Math.min(100, Math.max(0, progress.ratio * 100)) + "%";
    this.barLabel.textContent = progress.isMax
      ? "Max level reached"
      : `${Formatter.number(progress.current)} / ${Formatter.number(progress.needed)} Ki to next level`;
  }
}

class GokuView {
  constructor() {
    this.frame = document.getElementById("goku-frame");
    this.button = document.getElementById("goku-btn");
    this.image = document.getElementById("goku-img");
    this.particleLayer = document.getElementById("particle-layer");
    this.floatLayer = document.getElementById("float-layer");
  }

  onClick(callback) {
    this.button.addEventListener("click", callback);
  }

  showTransformation(transformation) {
    this.frame.dataset.stage = transformation.id;
    this.image.onerror = () => console.warn(`Afbeelding niet gevonden: ${transformation.image}`);
    this.image.src = transformation.image;
  }

  pulse() {
    this.button.classList.remove("pulse");
    void this.button.offsetWidth; 
    this.button.classList.add("pulse");
  }

  flash() {
    this.frame.style.filter = "brightness(2.2)";
    setTimeout(() => { this.frame.style.filter = ""; }, 400);
  }

  getOrigin(event) {
    const rect = this.frame.getBoundingClientRect();
    if (event.clientX === 0 && event.clientY === 0) {
      return { x: rect.width / 2, y: rect.height / 2 };
    }
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  spawnParticles(event) {
    const origin = this.getOrigin(event);
    for (let i = 0; i < 4; i++) {
      const p = document.createElement("div");
      p.classList.add("ki-particle");
      const angle = Math.random() * Math.PI * 2;
      const distance = 40 + Math.random() * 50;
      p.style.left = origin.x + "px";
      p.style.top = origin.y + "px";
      p.style.setProperty("--fly", `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`);
      this.particleLayer.appendChild(p);
      setTimeout(() => p.remove(), 700);
    }
  }

  spawnFloatText(amount, event) {
    const origin = this.getOrigin(event);
    const f = document.createElement("div");
    f.classList.add("float-text");
    f.textContent = "+" + Formatter.number(amount);
    f.style.left = origin.x + "px";
    f.style.top = origin.y + "px";
    this.floatLayer.appendChild(f);
    setTimeout(() => f.remove(), 850);
  }
}

class ShopView {
  constructor(onBuy) {
    this.list = document.getElementById("shop-list");
    this.onBuy = onBuy; 
  }

 
  render(shop, player) {
    this.list.innerHTML = "";

    shop.upgrades.forEach(u => {
      const locked = !shop.isUnlocked(u);
      const item = document.createElement("div");
      item.classList.add("upgrade-item");
      item.dataset.upgradeId = u.id;
      if (u.isMaxed) item.classList.add("maxed");
      else if (player.ki < u.cost || locked) item.classList.add("disabled");

      let metaText;
      if (u.maxLevel === Infinity) metaText = `Level ${u.level}`;
      else if (u.isMaxed) metaText = "Purchased";
      else if (locked) metaText = `Requires ${shop.getById(u.requires).name}`;
      else metaText = "One-time";

      item.innerHTML = `
        <div class="upgrade-icon">${u.icon}</div>
        <div class="upgrade-body">
          <h3>${u.name}</h3>
          <p>${u.desc}</p>
          <p class="upgrade-meta">${metaText}</p>
        </div>
        <div class="upgrade-price">${u.isMaxed ? "" : Formatter.number(u.cost) + " Ki"}</div>
      `;

      if (!u.isMaxed && !locked) {
        item.addEventListener("click", () => this.onBuy(u));
      }
      this.list.appendChild(item);
    });
  }


  updateAffordability(shop, player) {
    shop.upgrades.forEach(u => {
      if (u.isMaxed) return;
      const node = this.list.querySelector(`[data-upgrade-id="${u.id}"]`);
      if (node) node.classList.toggle("disabled", !shop.canBuy(u, player));
    });
  }
}

class TimelineView {
  constructor() {
    this.container = document.getElementById("timeline");
  }

  render(transformations, currentIndex) {
    this.container.innerHTML = "";
    transformations.forEach((t, i) => {
      const step = document.createElement("div");
      step.classList.add("timeline-step");
      if (i <= currentIndex) step.classList.add("unlocked");
      if (i === currentIndex) step.classList.add("current");
      step.innerHTML = `<h4>${t.name}</h4><p>${Formatter.number(t.threshold)} Ki</p>`;
      this.container.appendChild(step);
    });
  }
}


class AchievementView {
  constructor() {
    this.container = document.getElementById("achievements");
  }

  render(achievements, justUnlockedIds = []) {
    this.container.innerHTML = "";
    achievements.forEach(a => {
      const card = document.createElement("div");
      card.classList.add("ach-card");
      if (a.unlocked) card.classList.add("unlocked");
      if (justUnlockedIds.includes(a.id)) card.classList.add("pop");
      card.innerHTML = `<h4>${a.unlocked ? a.name : "???"}</h4><p>${a.unlocked ? a.desc : "Locked"}</p>`;
      this.container.appendChild(card);
    });
  }
}


class TransformOverlay {
  constructor() {
    this.overlay = document.getElementById("transform-overlay");
    this.name = document.getElementById("transform-name");
    this.meta = document.getElementById("transform-meta");
  }

  show(transformation, level, lifetimeKi) {
    this.name.textContent = transformation.name.toUpperCase();
    this.meta.textContent = `Level ${level} · ${Formatter.number(lifetimeKi)} Lifetime Ki`;
    this.overlay.classList.add("show");
    setTimeout(() => this.overlay.classList.remove("show"), 2200);
  }
}

class SettingsModal {
  constructor() {
    this.openBtn = document.getElementById("settings-btn");
    this.closeBtn = document.getElementById("settings-close");
    this.modal = document.getElementById("settings-modal");
    this.toggleSound = document.getElementById("toggle-sound");
    this.toggleMusic = document.getElementById("toggle-music");
    this.toggleMotion = document.getElementById("toggle-motion");
    this.saveBtn = document.getElementById("save-game-btn");
    this.resetBtn = document.getElementById("reset-game-btn");
    this.resetText = document.getElementById("reset-confirm-text");

    this.openBtn.addEventListener("click", () => this.open());
    this.closeBtn.addEventListener("click", () => this.close());
    this.modal.addEventListener("click", e => { if (e.target === this.modal) this.close(); });
  }

  open() { this.modal.classList.add("show"); }
  close() { this.modal.classList.remove("show"); }

  setValues(settings) {
    this.toggleSound.checked = settings.sound;
    this.toggleMusic.checked = settings.music;
    this.toggleMotion.checked = settings.reducedMotion;
  }

  showResetConfirm(visible) {
    this.resetText.classList.toggle("hidden", !visible);
  }

  bind(handlers) {
    this.toggleSound.addEventListener("change", () => handlers.onSound(this.toggleSound.checked));
    this.toggleMusic.addEventListener("change", () => handlers.onMusic(this.toggleMusic.checked));
    this.toggleMotion.addEventListener("change", () => handlers.onMotion(this.toggleMotion.checked));
    this.saveBtn.addEventListener("click", handlers.onSave);
    this.resetBtn.addEventListener("click", handlers.onReset);
  }
}
