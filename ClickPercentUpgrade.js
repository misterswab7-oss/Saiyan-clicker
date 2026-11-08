/* Subklasse van Upgrade: procentueel extra Ki per klik */

class ClickPercentUpgrade extends Upgrade {
  applyTo(stats) {
    stats.clickPercent += this.value * this.level;
  }

  describeEffect() {
    return `+${Math.round(this.value * 100)}% Ki per click per level`;
  }
}
