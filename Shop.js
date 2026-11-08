/* Model: kooplogica (geen DOM!) */

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
