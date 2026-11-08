/* Model: basisklasse voor alle upgrades (overerving + polymorfisme) */

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

  
  applyTo(stats) {}


  onPurchase(game) {
    game.sound.play(520, 0.1);
  }

  // beschrijving voor het upgrade-overzicht (subklassen overschrijven dit)
  describeEffect() {
    return "";
  }
}
