/* Subklasse van Upgrade: Ki per seconde */

class PassiveFlatUpgrade extends Upgrade {
  applyTo(stats) {
    stats.passiveFlat += this.value * this.level;
  }

  describeEffect() {
    return `+${Formatter.number(this.value)} Ki per second per level`;
  }
}
