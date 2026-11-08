/* View: Goku-plaatje, klik-animatie en effecten */

class GokuView {
  constructor() {
    this.frame = document.getElementById("goku-frame");
    this.button = document.getElementById("goku-btn");
    this.image = document.getElementById("goku-img");
    this.particleLayer = document.getElementById("particle-layer");
    this.floatLayer = document.getElementById("float-layer");
  }

  onClick(callback) {
    this.button.addEventListener("click", callback);
  }

  showTransformation(transformation) {
    this.frame.dataset.stage = transformation.id;
    this.image.onerror = () => console.warn(`Afbeelding niet gevonden: ${transformation.image}`);
    this.image.src = transformation.image;
  }

  pulse() {
    this.button.classList.remove("pulse");
    void this.button.offsetWidth; 
    this.button.classList.add("pulse");
  }

  flash() {
    this.frame.style.filter = "brightness(2.2)";
    setTimeout(() => { this.frame.style.filter = ""; }, 400);
  }

  getOrigin(event) {
    const rect = this.frame.getBoundingClientRect();
    if (event.clientX === 0 && event.clientY === 0) {
      return { x: rect.width / 2, y: rect.height / 2 };
    }
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  spawnParticles(event) {
    const origin = this.getOrigin(event);
    for (let i = 0; i < 4; i++) {
      const p = document.createElement("div");
      p.classList.add("ki-particle");
      const angle = Math.random() * Math.PI * 2;
      const distance = 40 + Math.random() * 50;
      p.style.left = origin.x + "px";
      p.style.top = origin.y + "px";
      p.style.setProperty("--fly", `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`);
      this.particleLayer.appendChild(p);
      setTimeout(() => p.remove(), 700);
    }
  }

  spawnFloatText(amount, event) {
    const origin = this.getOrigin(event);
    const f = document.createElement("div");
    f.classList.add("float-text");
    f.textContent = "+" + Formatter.number(amount);
    f.style.left = origin.x + "px";
    f.style.top = origin.y + "px";
    this.floatLayer.appendChild(f);
    setTimeout(() => f.remove(), 850);
  }
}
