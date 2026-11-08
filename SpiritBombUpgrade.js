/* Subklasse van GlobalMultiplierUpgrade (laadt NA GlobalMultiplierUpgrade.js) */

class SpiritBombUpgrade extends GlobalMultiplierUpgrade {
  onPurchase(game) {
    game.sound.play(140, 0.5);
    game.gokuView.flash();
  }

  describeEffect() {
    return `${super.describeEffect()} + screen flash`;
  }
}
