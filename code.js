/* =========================================================
   GOKU: KI ASCENSION  (O.O.P.-versie)

   Opbouw van dit bestand:
   1. CONFIG        - losse data (levels, transformaties, upgrades, achievements)
   2. MODEL-classes - Formatter, LevelSystem, Transformation, Upgrade (+ subclasses),
                      Achievement, Player, Settings, Shop, StatsCalculator
   3. SERVICE       - SoundManager, SaveManager
   4. VIEW-classes  - alles wat met de DOM te maken heeft
   5. Game          - de "baas" die alles aan elkaar knoopt
   ========================================================= */

const SAVE_KEY = "gokuKiAscensionSave";

/* =========================================================
   1. CONFIG
   ========================================================= */

// Lifetime Ki die nodig is per level
const LEVELS = [
  0, 1100, 2250, 4500, 10000, 20000, 35000, 50000, 75000, 100000,
  125000, 150000, 175000, 200000, 225000, 250000, 270000, 285000, 295000, 300000
];

// threshold = lifetime Ki nodig om de vorm te unlocken
// (pas deze getallen aan om het spel sneller/langzamer te maken)
const TRANSFORMATION_DATA = [
  { id: "base",          name: "Base Form",                  threshold: 0,          multiplier: 1, image: "vormen/base.gif" },
  { id: "ssj1",          name: "Super Saiyan",               threshold: 15000,      multiplier: 4.2, image: "vormen/ssj.gif" },
  { id: "ssj2",          name: "Super Saiyan 2",             threshold: 30000,     multiplier: 6, image: "vormen/ssj2.gif" },
  { id: "ssj3",          name: "Super Saiyan 3",             threshold: 90000 ,     multiplier: 8, image: "vormen/ssj3.gif" },
  { id: "ssj4",          name: "Super Saiyan 4",             threshold: 150000,    multiplier: 14, image: "vormen/ssj4.gif" },
  { id: "ssj4b",         name: "Super Saiyan 4B",            threshold: 2000000,    multiplier: 34, image: "vormen/ssj4b.gif" },
  { id: "ssj3beyond",    name: "Super Saiyan 3 Beyond",      threshold: 4000000,    multiplier: 68, image: "vormen/ssj3beyond.gif" },
  { id: "ssjg",          name: "Super Saiyan God",           threshold: 80000000,   multiplier: 250, image: "vormen/ssjg.gif" },
  { id: "ssjb",          name: "Super Saiyan Blue",          threshold: 90000000,   multiplier: 390, image: "vormen/ssjblue.gif" },
  { id: "ssjbluekioken", name: "Super Saiyan Blue Kaioken",  threshold: 180000000,  multiplier: 700, image: "vormen/ssjbluekioken.gif" },
  { id: "uisign",        name: "Ultra Instinct Sign",        threshold: 1200000000,  multiplier: 940, image: "vormen/uisign.gif" },
  { id: "uimastered",    name: "Mastered Ultra Instinct",    threshold: 1250000000,  multiplier: 1190, image: "vormen/masteredui.gif" },
  { id: "uibeyond",      name: "Beyond Ultra Instinct",      threshold: 30000000000, multiplier: 2000, image: "vormen/beyondui.gif" }
];

// kind: "clickFlat" | "clickPercent" | "passiveFlat" | "globalMult"
// special: true  -> wordt een SpiritBombUpgrade (eigen geluid + flash)
const UPGRADE_DATA = [
  { id: "senzu",      name: "Senzu Beans",             icon: "🫘", desc: "Recover your energy and increase Ki gathering.",        kind: "clickPercent", value: 0.05, baseCost: 50,       maxLevel: Infinity },
  { id: "chamber",    name: "Hyperbolic Time Chamber", icon: "⏳", desc: "Train for years while only days pass outside.",         kind: "passiveFlat",  value: 2,    baseCost: 100,      maxLevel: Infinity },
  { id: "kaioken",    name: "Kaioken",                 icon: "🔥", desc: "Push your body beyond its normal limits.",              kind: "globalMult",   value: 2,    baseCost: 1000,     maxLevel: 1 },
  { id: "kaioken2",   name: "Kaioken ×2",              icon: "🔥", desc: "Push the technique even further.",                      kind: "globalMult",   value: 2,    baseCost: 5000,     maxLevel: 1, requires: "kaioken" },
  { id: "kaioken10",  name: "Kaioken ×10",             icon: "🔥", desc: "A dangerously powerful multiplier.",                    kind: "globalMult",   value: 10,   baseCost: 20000,    maxLevel: 1, requires: "kaioken2" },
  { id: "kaioken20",  name: "Kaioken ×20",             icon: "🔥", desc: "On the edge of what your body can survive.",            kind: "globalMult",   value: 20,   baseCost: 80000,    maxLevel: 1, requires: "kaioken10" },
  { id: "zsword",     name: "Z Sword",                 icon: "⚔️", desc: "Train with the legendary sword of the Supreme Kai.",    kind: "clickFlat",    value: 50,   baseCost: 15000,    maxLevel: Infinity },
  { id: "fusion",     name: "Fusion Earrings",         icon: "💍", desc: "Combine power with another warrior.",                   kind: "globalMult",   value: 5,    baseCost: 100000,   maxLevel: 1 },
  { id: "gravity10",  name: "10× Gravity",             icon: "🌍", desc: "Train under ten times Earth's gravity.",                kind: "passiveFlat",  value: 50,   baseCost: 8000,     maxLevel: Infinity },
  { id: "gravity100", name: "100× Gravity",            icon: "🌑", desc: "Push your body far beyond normal limits.",              kind: "passiveFlat",  value: 175,  baseCost: 60000,    maxLevel: Infinity },
  { id: "gravity500", name: "500× Gravity",            icon: "🪐", desc: "Only the strongest warriors survive this training.",    kind: "passiveFlat",  value: 400,  baseCost: 300000,   maxLevel: Infinity },
  { id: "angel",      name: "Angel Guidance",          icon: "😇", desc: "Receive training from an angel.",                       kind: "globalMult",   value: 10,   baseCost: 1000000,  maxLevel: 1 },
  { id: "spiritbomb", name: "Spirit Bomb",             icon: "🌟", desc: "Gather energy from living beings across the universe.", kind: "globalMult",   value: 25,   baseCost: 5000000,  maxLevel: 1, special: true },
  { id: "godki",      name: "God Ki",                  icon: "✨", desc: "Unlock divine energy.",                                 kind: "globalMult",   value: 100,  baseCost: 50000000, maxLevel: 1 }
];

// check krijgt het Game-object mee
const ACHIEVEMENT_DATA = [
  { id: "firstki",  name: "First Ki",            desc: "Generate your first Ki.",   check: g => g.player.lifetimeKi >= 1 },
  { id: "powerup",  name: "Power Up",            desc: "Reach 1,000 Ki.",           check: g => g.player.lifetimeKi >= 1000 },
  { id: "over9000", name: "Over 9000!",          desc: "Reach 9,000 Ki.",           check: g => g.player.lifetimeKi >= 9000 },
  { id: "ssj",      name: "Super Saiyan",        desc: "Unlock SSJ1.",              check: g => g.hasTransformation("ssj1") },
  { id: "legend",   name: "Legendary Warrior",   desc: "Unlock SSJ3.",              check: g => g.hasTransformation("ssj3") },
  { id: "godly",    name: "Godly Power",         desc: "Unlock Super Saiyan God.",  check: g => g.hasTransformation("ssjg") },
  { id: "blue",     name: "Blue Evolution",      desc: "Unlock Super Saiyan Blue.", check: g => g.hasTransformation("ssjb") },
  { id: "beyond",   name: "Beyond Mortal Limits",desc: "Unlock Ultra Instinct.",    check: g => g.hasTransformation("uisign") }
];


/* =========================================================
   2. MODEL-CLASSES
   ========================================================= */

// ---------- Formatter: hulpklasse met alleen static methodes ----------
class Formatter {
  static number(num) {
    const units = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp"];
    if (num < 1000) return Math.floor(num).toString();
    let unitIndex = 0;
    while (num >= 1000 && unitIndex < units.length - 1) {
      num /= 1000;
      unitIndex++;
    }
    return num.toFixed(num < 10 ? 2 : num < 100 ? 1 : 0) + units[unitIndex];
  }
}

// ---------- LevelSystem: rekent uit welk level je bent ----------
class LevelSystem {
  constructor(thresholds) {
    this.thresholds = thresholds;
  }

  getLevel(lifetimeKi) {
    let level = 1;
    for (let i = 0; i < this.thresholds.length; i++) {
      if (lifetimeKi >= this.thresholds[i]) level = i + 1;
    }
    return level;
  }

  // geeft alles terug wat de level-balk nodig heeft
  getProgress(lifetimeKi) {
    const level = this.getLevel(lifetimeKi);
    if (level >= this.thresholds.length) {
      return { level, isMax: true, ratio: 1, current: 0, needed: 0 };
    }
    const prev = this.thresholds[level - 1];
    const next = this.thresholds[level];
    return {
      level,
      isMax: false,
      ratio: (lifetimeKi - prev) / (next - prev),
      current: lifetimeKi - prev,
      needed: next - prev
    };
  }
}

// ---------- Transformation ----------
class Transformation {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.threshold = data.threshold;
    this.multiplier = data.multiplier;
    this.image = data.image;
  }

  isReachedBy(lifetimeKi) {
    return lifetimeKi >= this.threshold;
  }
}

// ---------- Upgrade (basisklasse) ----------
// Subklassen overschrijven applyTo() en/of onPurchase() (polymorfisme)
class Upgrade {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.icon = data.icon;
    this.desc = data.desc;
    this.value = data.value;
    this.baseCost = data.baseCost;
    this.maxLevel = data.maxLevel;
    this.requires = data.requires || null;
    this.level = 0;
  }

  get cost() {
    return Math.round(this.baseCost * Math.pow(1.15, this.level));
  }

  get isMaxed() {
    return this.level >= this.maxLevel;
  }

  // Past het effect van deze upgrade toe op het stats-object.
  // De basisklasse doet niets; elke subklasse doet zijn eigen ding.
  applyTo(stats) {}

  // Wordt aangeroepen nadat de upgrade is gekocht.
  onPurchase(game) {
    game.sound.play(520, 0.1);
  }
}

class ClickFlatUpgrade extends Upgrade {
  applyTo(stats) {
    stats.clickFlat += this.value * this.level;
  }
}

class ClickPercentUpgrade extends Upgrade {
  applyTo(stats) {
    stats.clickPercent += this.value * this.level;
  }
}

class PassiveFlatUpgrade extends Upgrade {
  applyTo(stats) {
    stats.passiveFlat += this.value * this.level;
  }
}

class GlobalMultiplierUpgrade extends Upgrade {
  applyTo(stats) {
    // maxLevel is 1, dus level is 0 of 1
    stats.globalMult *= this.value;
  }
}

// SpiritBomb ERFT van GlobalMultiplierUpgrade: zelfde effect, ander geluid + flash
class SpiritBombUpgrade extends GlobalMultiplierUpgrade {
  onPurchase(game) {
    game.sound.play(140, 0.5);
    game.gokuView.flash();
  }
}

// ---------- UpgradeFactory: kiest de juiste klasse voor een stukje data ----------
class UpgradeFactory {
  static create(data) {
    if (data.special) return new SpiritBombUpgrade(data);

    const classes = {
      clickFlat: ClickFlatUpgrade,
      clickPercent: ClickPercentUpgrade,
      passiveFlat: PassiveFlatUpgrade,
      globalMult: GlobalMultiplierUpgrade
    };
    const UpgradeClass = classes[data.kind];
    if (!UpgradeClass) throw new Error(`Onbekend upgrade-type: ${data.kind}`);
    return new UpgradeClass(data);
  }
}

// ---------- Achievement ----------
class Achievement {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.desc = data.desc;
    this.checkFn = data.check;
    this.unlocked = false;
  }

  // true als hij net unlocked is
  tryUnlock(game) {
    if (!this.unlocked && this.checkFn(game)) {
      this.unlocked = true;
      return true;
    }
    return false;
  }
}

// ---------- Player: de spelerstatus ----------
class Player {
  constructor() {
    this.ki = 0;
    this.lifetimeKi = 0;
    this.transformationIndex = 0;
    this.kiPerClick = 1;
    this.kiPerSecond = 0;
  }

  addKi(amount) {
    this.ki += amount;
    this.lifetimeKi += amount;
  }

  spend(amount) {
    this.ki -= amount;
  }
}

// ---------- Settings ----------
class Settings {
  constructor() {
    this.sound = true;
    this.music = false;
    this.reducedMotion = false;
  }

  load(data) {
    if (!data) return;
    if (typeof data.sound === "boolean") this.sound = data.sound;
    if (typeof data.music === "boolean") this.music = data.music;
    if (typeof data.reducedMotion === "boolean") this.reducedMotion = data.reducedMotion;
  }

  toJSON() {
    return { sound: this.sound, music: this.music, reducedMotion: this.reducedMotion };
  }
}

// ---------- Shop: logica voor kopen (geen DOM!) ----------
class Shop {
  constructor(upgrades) {
    this.upgrades = upgrades;
  }

  getById(id) {
    return this.upgrades.find(u => u.id === id);
  }

  isUnlocked(upgrade) {
    return !upgrade.requires || this.getById(upgrade.requires).level >= 1;
  }

  canBuy(upgrade, player) {
    return !upgrade.isMaxed && this.isUnlocked(upgrade) && player.ki >= upgrade.cost;
  }

  // true als het kopen gelukt is
  buy(upgrade, player) {
    if (!this.canBuy(upgrade, player)) return false;
    player.spend(upgrade.cost);
    upgrade.level += 1;
    return true;
  }
}

// ---------- StatsCalculator: rekent Ki per klik en per seconde uit ----------
class StatsCalculator {
  static calculate(upgrades, transformation) {
    const stats = { clickFlat: 1, clickPercent: 1, passiveFlat: 0, globalMult: 1 };

    upgrades
      .filter(u => u.level > 0)
      .forEach(u => u.applyTo(stats));

    const m = transformation.multiplier;
    return {
      kiPerClick: Math.max(1, Math.round(stats.clickFlat * stats.clickPercent * stats.globalMult * m)),
      kiPerSecond: Math.round(stats.passiveFlat * stats.globalMult * m)
    };
  }
}


/* =========================================================
   3. SERVICES
   ========================================================= */

// ---------- SoundManager: simpele Web Audio bliepjes ----------
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
      // Web Audio niet beschikbaar; negeren
    }
  }
}

// ---------- SaveManager: localStorage ----------
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


/* =========================================================
   4. VIEW-CLASSES (alles met document.getElementById enz.)
   ========================================================= */

// ---------- StatsView: linker paneel + Ki-teller ----------
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

// ---------- GokuView: plaatje, klik-animatie en effecten ----------
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
    void this.button.offsetWidth; // forceer reflow zodat de animatie opnieuw start
    this.button.classList.add("pulse");
  }

  flash() {
    this.frame.style.filter = "brightness(2.2)";
    setTimeout(() => { this.frame.style.filter = ""; }, 400);
  }

  // positie van de klik binnen het frame (bij toetsenbord-klik: midden)
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

// ---------- ShopView: rechter paneel ----------
class ShopView {
  constructor(onBuy) {
    this.list = document.getElementById("shop-list");
    this.onBuy = onBuy; // callback(upgrade)
  }

  // Volledige herbouw (na aankoop of bij opstarten)
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

  // Lichtgewicht: zet alleen de "disabled"-class goed (wordt bij elke klik/tick aangeroepen)
  updateAffordability(shop, player) {
    shop.upgrades.forEach(u => {
      if (u.isMaxed) return;
      const node = this.list.querySelector(`[data-upgrade-id="${u.id}"]`);
      if (node) node.classList.toggle("disabled", !shop.canBuy(u, player));
    });
  }
}

// ---------- TimelineView ----------
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

// ---------- AchievementView ----------
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

// ---------- TransformOverlay: de flits bij een nieuwe vorm ----------
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

// ---------- SettingsModal ----------
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

  // handlers: { onSound, onMusic, onMotion, onSave, onReset }
  bind(handlers) {
    this.toggleSound.addEventListener("change", () => handlers.onSound(this.toggleSound.checked));
    this.toggleMusic.addEventListener("change", () => handlers.onMusic(this.toggleMusic.checked));
    this.toggleMotion.addEventListener("change", () => handlers.onMotion(this.toggleMotion.checked));
    this.saveBtn.addEventListener("click", handlers.onSave);
    this.resetBtn.addEventListener("click", handlers.onReset);
  }
}


/* =========================================================
   5. GAME: knoopt alle classes aan elkaar
   ========================================================= */
class Game {
  constructor() {
    // model
    this.settings = new Settings();
    this.player = new Player();
    this.levels = new LevelSystem(LEVELS);
    this.transformations = TRANSFORMATION_DATA.map(d => new Transformation(d));
    this.upgrades = UPGRADE_DATA.map(d => UpgradeFactory.create(d));
    this.achievements = ACHIEVEMENT_DATA.map(d => new Achievement(d));
    this.shop = new Shop(this.upgrades);

    // services
    this.sound = new SoundManager(this.settings);
    this.saveManager = new SaveManager(SAVE_KEY);

    // views
    this.statsView = new StatsView();
    this.gokuView = new GokuView();
    this.shopView = new ShopView(upgrade => this.buyUpgrade(upgrade));
    this.timelineView = new TimelineView();
    this.achievementView = new AchievementView();
    this.transformOverlay = new TransformOverlay();
    this.settingsModal = new SettingsModal();

    this.saveTimeout = null;
    this.resetArmed = false;
    this.resetting = false;
  }

  get currentTransformation() {
    return this.transformations[this.player.transformationIndex];
  }

  hasTransformation(id) {
    const index = this.transformations.findIndex(t => t.id === id);
    return index >= 0 && index <= this.player.transformationIndex;
  }

  // ---------- opstarten ----------
  start() {
    this.load();

    this.settingsModal.setValues(this.settings);
    this.applyMotionSetting();
    this.settingsModal.bind({
      onSound: v => { this.settings.sound = v; this.save(); },
      onMusic: v => { this.settings.music = v; this.save(); },
      onMotion: v => { this.settings.reducedMotion = v; this.applyMotionSetting(); this.save(); },
      onSave: () => this.save(),
      onReset: () => this.handleReset()
    });

    document.getElementById("save-btn").addEventListener("click", () => this.save());
    this.gokuView.onClick(event => this.handleClick(event));

    this.gokuView.showTransformation(this.currentTransformation);
    this.recalcStats();
    this.shopView.render(this.shop, this.player);
    this.renderStats();
    this.timelineView.render(this.transformations, this.player.transformationIndex);
    this.achievementView.render(this.achievements);

    // passieve Ki elke seconde, autosave elke 10 seconden
    setInterval(() => this.tick(), 1000);
    setInterval(() => this.save(), 10000);
  }

  applyMotionSetting() {
    document.body.classList.toggle("reduced-motion", this.settings.reducedMotion);
  }

  // ---------- gameplay ----------
  handleClick(event) {
    const amount = this.player.kiPerClick;
    this.addKi(amount);
    this.gokuView.spawnParticles(event);
    this.gokuView.spawnFloatText(amount, event);
    this.gokuView.pulse();
    this.sound.play(880, 0.06);
    this.saveThrottled();
  }

  tick() {
    if (this.player.kiPerSecond > 0) this.addKi(this.player.kiPerSecond);
  }

  addKi(amount) {
    this.player.addKi(amount);
    this.checkTransformation();
    this.checkAchievements();
    this.renderStats();
  }

  recalcStats() {
    const stats = StatsCalculator.calculate(this.upgrades, this.currentTransformation);
    this.player.kiPerClick = stats.kiPerClick;
    this.player.kiPerSecond = stats.kiPerSecond;
  }

  checkTransformation() {
    for (let i = this.transformations.length - 1; i > this.player.transformationIndex; i--) {
      if (this.transformations[i].isReachedBy(this.player.lifetimeKi)) {
        this.unlockTransformation(i);
        break;
      }
    }
  }

  unlockTransformation(index) {
    this.player.transformationIndex = index;
    const t = this.currentTransformation;

    this.gokuView.showTransformation(t);
    this.recalcStats();
    this.renderStats();
    this.timelineView.render(this.transformations, index);

    const level = this.levels.getLevel(this.player.lifetimeKi);
    this.transformOverlay.show(t, level, this.player.lifetimeKi);
    this.sound.play(220, 0.4);
    this.save();
  }

  checkAchievements() {
    const newlyUnlocked = this.achievements.filter(a => a.tryUnlock(this));
    if (newlyUnlocked.length > 0) {
      this.achievementView.render(this.achievements, newlyUnlocked.map(a => a.id));
    }
  }

  buyUpgrade(upgrade) {
    if (!this.shop.buy(upgrade, this.player)) return;
    this.recalcStats();
    this.renderStats();
    this.shopView.render(this.shop, this.player);
    upgrade.onPurchase(this); // polymorfisme: elke upgrade doet zijn eigen ding
    this.save();
  }

  renderStats() {
    const progress = this.levels.getProgress(this.player.lifetimeKi);
    this.statsView.render(this.player, this.currentTransformation, progress);
    this.shopView.updateAffordability(this.shop, this.player);
  }

  // ---------- opslaan / laden / resetten ----------
  toSaveData() {
    const upgrades = {};
    this.upgrades.forEach(u => { upgrades[u.id] = u.level; });
    const achievements = {};
    this.achievements.filter(a => a.unlocked).forEach(a => { achievements[a.id] = true; });

    return {
      ki: this.player.ki,
      lifetimeKi: this.player.lifetimeKi,
      transformationIndex: this.player.transformationIndex,
      upgrades,
      achievements,
      settings: this.settings.toJSON()
    };
  }

  load() {
    const data = this.saveManager.load();
    if (!data) return;

    this.player.ki = Number(data.ki) || 0;
    this.player.lifetimeKi = Number(data.lifetimeKi) || 0;

    const savedIndex = Number(data.transformationIndex) || 0;
    this.player.transformationIndex = Math.min(Math.max(savedIndex, 0), this.transformations.length - 1);

    const savedUpgrades = data.upgrades || {};
    this.upgrades.forEach(u => { u.level = Number(savedUpgrades[u.id]) || 0; });

    const savedAchievements = data.achievements || {};
    this.achievements.forEach(a => { a.unlocked = !!savedAchievements[a.id]; });

    this.settings.load(data.settings);
  }

  save() {
    if (this.resetting) return;
    this.saveManager.save(this.toSaveData());
  }

  saveThrottled() {
    clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(() => this.save(), 1500);
  }

  handleReset() {
    if (!this.resetArmed) {
      this.resetArmed = true;
      this.settingsModal.showResetConfirm(true);
      setTimeout(() => {
        this.resetArmed = false;
        this.settingsModal.showResetConfirm(false);
      }, 4000);
      return;
    }
    this.resetting = true; // voorkomt dat autosave de save terugzet
    this.saveManager.clear();
    location.reload();
  }
}

/* =========================================================
   OPSTARTEN
   ========================================================= */
const game = new Game();
game.start();
