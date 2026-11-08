/* Service: zet de spelstatus om naar opslagdata en weer terug */

class GameStorage {
  constructor(saveManager) {
    this.saveManager = saveManager;
  }

  toSaveData(game) {
    const upgrades = {};
    game.upgrades.forEach(u => { upgrades[u.id] = u.level; });
    const achievements = {};
    game.achievements.filter(a => a.unlocked).forEach(a => { achievements[a.id] = true; });

    return {
      ki: game.player.ki,
      lifetimeKi: game.player.lifetimeKi,
      transformationIndex: game.player.transformationIndex,
      upgrades,
      achievements,
      settings: game.settings.toJSON()
    };
  }

  // zet opgeslagen data terug in het Game-object
  load(game) {
    const data = this.saveManager.load();
    if (!data) return;

    game.player.ki = Number(data.ki) || 0;
    game.player.lifetimeKi = Number(data.lifetimeKi) || 0;

    const savedIndex = Number(data.transformationIndex) || 0;
    game.player.transformationIndex = Math.min(Math.max(savedIndex, 0), game.transformations.length - 1);

    const savedUpgrades = data.upgrades || {};
    game.upgrades.forEach(u => { u.level = Number(savedUpgrades[u.id]) || 0; });

    const savedAchievements = data.achievements || {};
    game.achievements.forEach(a => { a.unlocked = !!savedAchievements[a.id]; });

    game.settings.load(data.settings);
  }

  save(game) {
    this.saveManager.save(this.toSaveData(game));
  }

  clear() {
    this.saveManager.clear();
  }
}
