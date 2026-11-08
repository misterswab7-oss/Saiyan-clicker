/* Game: knoopt model, services en views aan elkaar */

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
    this.storage = new GameStorage(new SaveManager(SAVE_KEY));

    // views
    this.statsView = new StatsView();
    this.gokuView = new GokuView();
    this.shopView = new ShopView(upgrade => this.buyUpgrade(upgrade));
    this.timelineView = new TimelineView();
    this.achievementView = new AchievementView();
    this.upgradeOverviewView = new UpgradeOverviewView();
    this.transformOverlay = new TransformOverlay();
    this.settingsModal = new SettingsModal();

    // controllers
    this.resetHandler = new ResetHandler(this.settingsModal, () => this.reset());

    this.saveTimeout = null;
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
      onReset: () => this.resetHandler.handle()
    });

    document.getElementById("save-btn").addEventListener("click", () => this.save());
    this.gokuView.onClick(event => this.handleClick(event));

    this.gokuView.showTransformation(this.currentTransformation);
    this.recalcStats();
    this.shopView.render(this.shop, this.player);
    this.renderStats();
    this.timelineView.render(this.transformations, this.player.transformationIndex);
    this.achievementView.render(this.achievements);
    this.upgradeOverviewView.render(this.shop);

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
    this.upgradeOverviewView.render(this.shop);
    upgrade.onPurchase(this); 
    this.save();
  }

  renderStats() {
    const progress = this.levels.getProgress(this.player.lifetimeKi);
    this.statsView.render(this.player, this.currentTransformation, progress);
    this.shopView.updateAffordability(this.shop, this.player);
  }


  load() {
    this.storage.load(this);
  }

  save() {
    if (this.resetting) return;
    this.storage.save(this);
  }

  saveThrottled() {
    clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(() => this.save(), 1500);
  }

  reset() {
    this.resetting = true; // voorkomt dat autosave de save terugzet
    this.storage.clear();
    location.reload();
  }
}
