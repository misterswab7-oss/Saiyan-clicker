/* View: transformatie-tijdlijn */

class TimelineView {
  constructor() {
    this.container = document.getElementById("timeline");
  }

  render(transformations, currentIndex) {
    this.container.innerHTML = "";
    transformations.forEach((t, i) => {
      const step = document.createElement("div");
      step.classList.add("timeline-step");
      if (i <= currentIndex) step.classList.add("unlocked");
      if (i === currentIndex) step.classList.add("current");
      step.innerHTML = `<h4>${t.name}</h4><p>${Formatter.number(t.threshold)} Ki</p>`;
      this.container.appendChild(step);
    });
  }
}
