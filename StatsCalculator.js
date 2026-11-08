/* Model: rekent Ki per klik en per seconde uit */

class StatsCalculator {
  static calculate(upgrades, transformation) {
    const stats = { clickFlat: 1, clickPercent: 1, passiveFlat: 0, globalMult: 1 };

    upgrades
      .filter(u => u.level > 0)
      .forEach(u => u.applyTo(stats));

    const m = transformation.multiplier;
    return {
      kiPerClick: Math.max(1, Math.round(stats.clickFlat * stats.clickPercent * stats.globalMult * m)),
      kiPerSecond: Math.round(stats.passiveFlat * stats.globalMult * m)
    };
  }
}
