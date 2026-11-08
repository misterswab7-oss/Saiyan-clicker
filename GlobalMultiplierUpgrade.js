/* Subklasse van Upgrade: vermenigvuldigt alles */

class GlobalMultiplierUpgrade extends Upgrade {
  applyTo(stats) {

    stats.globalMult *= this.value;
  }

  describeEffect() {
    return `×${this.value} all Ki (click and passive)`;
  }
}
