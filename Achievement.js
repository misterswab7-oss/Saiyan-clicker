/* Model: een achievement */

class Achievement {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.desc = data.desc;
    this.checkFn = data.check;
    this.unlocked = false;
  }

  // true als hij net unlocked is
  tryUnlock(game) {
    if (!this.unlocked && this.checkFn(game)) {
      this.unlocked = true;
      return true;
    }
    return false;
  }
}
