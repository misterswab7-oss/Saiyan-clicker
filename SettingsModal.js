/* View: instellingen-venster */

class SettingsModal {
  constructor() {
    this.openBtn = document.getElementById("settings-btn");
    this.closeBtn = document.getElementById("settings-close");
    this.modal = document.getElementById("settings-modal");
    this.toggleSound = document.getElementById("toggle-sound");
    this.toggleMusic = document.getElementById("toggle-music");
    this.toggleMotion = document.getElementById("toggle-motion");
    this.saveBtn = document.getElementById("save-game-btn");
    this.resetBtn = document.getElementById("reset-game-btn");
    this.resetText = document.getElementById("reset-confirm-text");

    this.openBtn.addEventListener("click", () => this.open());
    this.closeBtn.addEventListener("click", () => this.close());
    this.modal.addEventListener("click", e => { if (e.target === this.modal) this.close(); });
  }

  open() { this.modal.classList.add("show"); }
  close() { this.modal.classList.remove("show"); }

  setValues(settings) {
    this.toggleSound.checked = settings.sound;
    this.toggleMusic.checked = settings.music;
    this.toggleMotion.checked = settings.reducedMotion;
  }

  showResetConfirm(visible) {
    this.resetText.classList.toggle("hidden", !visible);
  }

  bind(handlers) {
    this.toggleSound.addEventListener("change", () => handlers.onSound(this.toggleSound.checked));
    this.toggleMusic.addEventListener("change", () => handlers.onMusic(this.toggleMusic.checked));
    this.toggleMotion.addEventListener("change", () => handlers.onMotion(this.toggleMotion.checked));
    this.saveBtn.addEventListener("click", handlers.onSave);
    this.resetBtn.addEventListener("click", handlers.onReset);
  }
}
