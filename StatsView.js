/* View: linker paneel + Ki-teller */

class StatsView {
  constructor() {
    this.kiValue = document.getElementById("ki-value");
    this.level = document.getElementById("stat-level");
    this.transformation = document.getElementById("stat-transformation");
    this.kpc = document.getElementById("stat-kpc");
    this.kps = document.getElementById("stat-kps");
    this.lifetime = document.getElementById("stat-lifetime");
    this.barFill = document.getElementById("level-bar-fill");
    this.barLabel = document.getElementById("level-bar-label");
  }

  render(player, transformation, progress) {
    this.kiValue.textContent = Formatter.number(player.ki);
    this.kpc.textContent = Formatter.number(player.kiPerClick);
    this.kps.textContent = Formatter.number(player.kiPerSecond);
    this.lifetime.textContent = Formatter.number(player.lifetimeKi);
    this.transformation.textContent = transformation.name;
    this.level.textContent = progress.level;

    this.barFill.style.width = Math.min(100, Math.max(0, progress.ratio * 100)) + "%";
    this.barLabel.textContent = progress.isMax
      ? "Max level reached"
      : `${Formatter.number(progress.current)} / ${Formatter.number(progress.needed)} Ki to next level`;
  }
}
