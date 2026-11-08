/* Controller: "klik twee keer om te resetten" */

class ResetHandler {
  constructor(settingsModal, onConfirm) {
    this.settingsModal = settingsModal;
    this.onConfirm = onConfirm; // wordt aangeroepen bij de tweede klik
    this.armed = false;
  }

  handle() {
    if (!this.armed) {
      this.armed = true;
      this.settingsModal.showResetConfirm(true);
      setTimeout(() => {
        this.armed = false;
        this.settingsModal.showResetConfirm(false);
      }, 4000);
      return;
    }
    this.onConfirm();
  }
}
