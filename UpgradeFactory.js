/* Factory: kiest de juiste Upgrade-subklasse (laadt NA alle upgrade-klassen) */

class UpgradeFactory {
  static create(data) {
    if (data.special) return new SpiritBombUpgrade(data);

    const classes = {
      clickFlat: ClickFlatUpgrade,
      clickPercent: ClickPercentUpgrade,
      passiveFlat: PassiveFlatUpgrade,
      globalMult: GlobalMultiplierUpgrade
    };
    const UpgradeClass = classes[data.kind];
    if (!UpgradeClass) throw new Error(`Onbekend upgrade-type: ${data.kind}`);
    return new UpgradeClass(data);
  }
}
