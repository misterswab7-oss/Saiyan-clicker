/* View: achievements */

class AchievementView {
  constructor() {
    this.container = document.getElementById("achievements");
  }

  render(achievements, justUnlockedIds = []) {
    this.container.innerHTML = "";
    achievements.forEach(a => {
      const card = document.createElement("div");
      card.classList.add("ach-card");
      if (a.unlocked) card.classList.add("unlocked");
      if (justUnlockedIds.includes(a.id)) card.classList.add("pop");
      card.innerHTML = `<h4>${a.unlocked ? a.name : "???"}</h4><p>${a.unlocked ? a.desc : "Locked"}</p>`;
      this.container.appendChild(card);
    });
  }
}
