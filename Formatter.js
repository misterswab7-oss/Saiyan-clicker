/* Hulpklasse: getallen netjes weergeven (1.5K, 2.3M, ...) */

class Formatter {
  static number(num) {
    const units = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp"];
    if (num < 1000) return Math.floor(num).toString();
    let unitIndex = 0;
    while (num >= 1000 && unitIndex < units.length - 1) {
      num /= 1000;
      unitIndex++;
    }
    return num.toFixed(num < 10 ? 2 : num < 100 ? 1 : 0) + units[unitIndex];
  }
}
