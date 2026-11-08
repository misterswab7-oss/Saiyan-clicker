/* Subklasse van Upgrade: vast extra Ki per klik */

class ClickFlatUpgrade extends Upgrade {
  applyTo(stats) {
    stats.clickFlat += this.value * this.level;
  }

  describeEffect() {
    return `+${Formatter.number(this.value)} Ki per click per level`;
  }
}
