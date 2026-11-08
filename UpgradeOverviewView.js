/* View: overzichtstabel van alle upgrades (onder de transformatie-tijdlijn) */

class UpgradeOverviewView {
  constructor() {
    this.table = document.getElementById("upgrade-overview");
  }

  render(shop) {
    const rows = shop.upgrades.map(u => {
      const requires = u.requires ? shop.getById(u.requires).name : "–";
      const max = u.maxLevel === Infinity ? "∞" : u.maxLevel;
      const cost = u.isMaxed ? "–" : `${Formatter.number(u.cost)} Ki`;
      let owned = "–";
      if (u.maxLevel === Infinity) owned = u.level > 0 ? `Level ${u.level}` : "–";
      else if (u.isMaxed) owned = "Purchased";

      return `
        <tr class="${u.level > 0 ? "owned" : ""}">
          <td><span class="ov-icon">${u.icon}</span>${u.name}</td>
          <td>${u.describeEffect()}</td>
          <td class="num">${cost}</td>
          <td class="num">${max}</td>
          <td>${requires}</td>
          <td class="num">${owned}</td>
        </tr>`;
    }).join("");

    this.table.innerHTML = `
      <thead>
        <tr><th>Upgrade</th><th>Effect</th><th class="num">Cost</th><th class="num">Max</th><th>Requires</th><th class="num">Owned</th></tr>
      </thead>
      <tbody>${rows}</tbody>`;
  }
}
