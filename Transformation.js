/* Model: een transformatie (vorm van Goku) */

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
