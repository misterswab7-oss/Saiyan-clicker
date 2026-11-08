/* View: flits bij een nieuwe vorm */

class TransformOverlay {
  constructor() {
    this.overlay = document.getElementById("transform-overlay");
    this.name = document.getElementById("transform-name");
    this.meta = document.getElementById("transform-meta");
  }

  show(transformation, level, lifetimeKi) {
    this.name.textContent = transformation.name.toUpperCase();
    this.meta.textContent = `Level ${level} · ${Formatter.number(lifetimeKi)} Lifetime Ki`;
    this.overlay.classList.add("show");
    setTimeout(() => this.overlay.classList.remove("show"), 2200);
  }
}
