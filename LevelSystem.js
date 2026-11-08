/* Model: berekent het level en de voortgang */

class LevelSystem {
  constructor(thresholds) {
    this.thresholds = thresholds;
  }

  getLevel(lifetimeKi) {
    let level = 1;
    for (let i = 0; i < this.thresholds.length; i++) {
      if (lifetimeKi >= this.thresholds[i]) level = i + 1;
    }
    return level;
  }

  getProgress(lifetimeKi) {
    const level = this.getLevel(lifetimeKi);
    if (level >= this.thresholds.length) {
      return { level, isMax: true, ratio: 1, current: 0, needed: 0 };
    }
    const prev = this.thresholds[level - 1];
    const next = this.thresholds[level];
    return {
      level,
      isMax: false,
      ratio: (lifetimeKi - prev) / (next - prev),
      current: lifetimeKi - prev,
      needed: next - prev
    };
  }
}
