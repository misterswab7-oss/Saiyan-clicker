/* Model: de spelerstatus */

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
