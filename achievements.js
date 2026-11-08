/* Config: achievements (check krijgt het Game-object mee) */

const ACHIEVEMENT_DATA = [
  { id: "firstki",  name: "First Ki",            desc: "Generate your first Ki.",   check: g => g.player.lifetimeKi >= 1 },
  { id: "powerup",  name: "Power Up",            desc: "Reach 1,000 Ki.",           check: g => g.player.lifetimeKi >= 1000 },
  { id: "over9000", name: "Over 9000!",          desc: "Reach 9,000 Ki.",           check: g => g.player.lifetimeKi >= 9000 },
  { id: "ssj",      name: "Super Saiyan",        desc: "Unlock SSJ1.",              check: g => g.hasTransformation("ssj1") },
  { id: "legend",   name: "Legendary Warrior",   desc: "Unlock SSJ3.",              check: g => g.hasTransformation("ssj3") },
  { id: "godly",    name: "Godly Power",         desc: "Unlock Super Saiyan God.",  check: g => g.hasTransformation("ssjg") },
  { id: "blue",     name: "Blue Evolution",      desc: "Unlock Super Saiyan Blue.", check: g => g.hasTransformation("ssjb") },
  { id: "beyond",   name: "Beyond Mortal Limits",desc: "Unlock Ultra Instinct.",    check: g => g.hasTransformation("uisign") }
];
