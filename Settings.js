/* Model: instellingen */

class Settings {
  constructor() {
    this.sound = true;
    this.music = false;
    this.reducedMotion = false;
  }

  load(data) {
    if (!data) return;
    if (typeof data.sound === "boolean") this.sound = data.sound;
    if (typeof data.music === "boolean") this.music = data.music;
    if (typeof data.reducedMotion === "boolean") this.reducedMotion = data.reducedMotion;
  }

  toJSON() {
    return { sound: this.sound, music: this.music, reducedMotion: this.reducedMotion };
  }
}
