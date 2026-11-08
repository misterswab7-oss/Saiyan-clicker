/* View: upgrade-shop */

class ShopView {
  constructor(onBuy) {
    this.list = document.getElementById("shop-list");
    this.onBuy = onBuy; 
  }

 
  render(shop, player) {
    this.list.innerHTML = "";

    shop.upgrades.forEach(u => {
      const locked = !shop.isUnlocked(u);
      const item = document.createElement("div");
      item.classList.add("upgrade-item");
      item.dataset.upgradeId = u.id;
      if (u.isMaxed) item.classList.add("maxed");
      else if (player.ki < u.cost || locked) item.classList.add("disabled");

      let metaText;
      if (u.maxLevel === Infinity) metaText = `Level ${u.level}`;
      else if (u.isMaxed) metaText = "Purchased";
      else if (locked) metaText = `Requires ${shop.getById(u.requires).name}`;
      else metaText = "One-time";

      item.innerHTML = `
        <div class="upgrade-icon">${u.icon}</div>
        <div class="upgrade-body">
          <h3>${u.name}</h3>
          <p>${u.desc}</p>
          <p class="upgrade-meta">${metaText}</p>
        </div>
        <div class="upgrade-price">${u.isMaxed ? "" : Formatter.number(u.cost) + " Ki"}</div>
      `;

      if (!u.isMaxed && !locked) {
        item.addEventListener("click", () => this.onBuy(u));
      }
      this.list.appendChild(item);
    });
  }


  updateAffordability(shop, player) {
    shop.upgrades.forEach(u => {
      if (u.isMaxed) return;
      const node = this.list.querySelector(`[data-upgrade-id="${u.id}"]`);
      if (node) node.classList.toggle("disabled", !shop.canBuy(u, player));
    });
  }
}
