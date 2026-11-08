/* Service: opslaan in localStorage */

class SaveManager {
  constructor(key) {
    this.key = key;
  }

  save(data) {
    localStorage.setItem(this.key, JSON.stringify(data));
  }

  load() {
    const raw = localStorage.getItem(this.key);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.warn("Kon opgeslagen spel niet laden:", e);
      return null;
    }
  }

  clear() {
    localStorage.removeItem(this.key);
  }
}
