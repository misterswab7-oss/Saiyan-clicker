const SAVE_KEY = "gokuKiAscensionSave";

/* =========================================================
   1. CONFIG
   ========================================================= */

// Lifetime Ki die nodig is per level
const LEVELS = [
  0, 1100, 2250, 4500, 10000, 20000, 35000, 50000, 75000, 100000,
  125000, 150000, 175000, 200000, 225000, 250000, 270000, 285000, 295000, 300000
];

// threshold = lifetime Ki nodig om de vorm te unlocken
// (pas deze getallen aan om het spel sneller/langzamer te maken)
const TRANSFORMATION_DATA = [
  { id: "base",          name: "Base Form",                  threshold: 0,          multiplier: 1, image: "vormen/base.gif" },
  { id: "ssj1",          name: "Super Saiyan",               threshold: 15000,      multiplier: 4.2, image: "vormen/ssj.gif" },
  { id: "ssj2",          name: "Super Saiyan 2",             threshold: 30000,     multiplier: 6, image: "vormen/ssj2.gif" },
  { id: "ssj3",          name: "Super Saiyan 3",             threshold: 90000 ,     multiplier: 8, image: "vormen/ssj3.gif" },
  { id: "ssj4",          name: "Super Saiyan 4",             threshold: 150000,    multiplier: 14, image: "vormen/ssj4.gif" },
  { id: "ssj4b",         name: "Super Saiyan 4 blue",        threshold: 2000000,    multiplier: 34, image: "vormen/ssj4b.gif" },
  { id: "ssj3beyond",    name: "Super Saiyan 3 Beyond",      threshold: 4000000,    multiplier: 68, image: "vormen/ssj3beyond.gif" },
  { id: "ssjg",          name: "Super Saiyan God",           threshold: 80000000,   multiplier: 250, image: "vormen/ssjg.gif" },
  { id: "ssjb",          name: "Super Saiyan Blue",          threshold: 90000000,   multiplier: 390, image: "vormen/ssjblue.gif" },
  { id: "ssjbluekioken", name: "Super Saiyan Blue Kaioken",  threshold: 180000000,  multiplier: 700, image: "vormen/ssjbluekioken.gif" },
  { id: "uisign",        name: "Ultra Instinct Sign",        threshold: 1200000000,  multiplier: 940, image: "vormen/uisign.gif" },
  { id: "uimastered",    name: "Mastered Ultra Instinct",    threshold: 1250000000,  multiplier: 1190, image: "vormen/masteredui.gif" },
  { id: "uibeyond",      name: "Beyond Ultra Instinct",      threshold: 30000000000, multiplier: 2000, image: "vormen/beyondui.gif" }
];

// kind: "clickFlat" | "clickPercent" | "passiveFlat" | "globalMult"
// special: true  -> wordt een SpiritBombUpgrade (eigen geluid + flash)
const UPGRADE_DATA = [
  { id: "senzu",      name: "Senzu Beans",             icon: "🫘", desc: "Recover your energy and increase Ki gathering.",        kind: "clickPercent", value: 0.05, baseCost: 50,       maxLevel: Infinity },
  { id: "chamber",    name: "Hyperbolic Time Chamber", icon: "⏳", desc: "Train for years while only days pass outside.",         kind: "passiveFlat",  value: 2,    baseCost: 100,      maxLevel: Infinity },
  { id: "kaioken",    name: "Kaioken",                 icon: "🔥", desc: "Push your body beyond its normal limits.",              kind: "globalMult",   value: 2,    baseCost: 1000,     maxLevel: 1 },
  { id: "kaioken2",   name: "Kaioken ×2",              icon: "🔥", desc: "Push the technique even further.",                      kind: "globalMult",   value: 2,    baseCost: 5000,     maxLevel: 1, requires: "kaioken" },
  { id: "kaioken10",  name: "Kaioken ×10",             icon: "🔥", desc: "A dangerously powerful multiplier.",                    kind: "globalMult",   value: 10,   baseCost: 20000,    maxLevel: 1, requires: "kaioken2" },
  { id: "kaioken20",  name: "Kaioken ×20",             icon: "🔥", desc: "On the edge of what your body can survive.",            kind: "globalMult",   value: 20,   baseCost: 80000,    maxLevel: 1, requires: "kaioken10" },
  { id: "zsword",     name: "Z Sword",                 icon: "⚔️", desc: "Train with the legendary sword of the Supreme Kai.",    kind: "clickFlat",    value: 50,   baseCost: 15000,    maxLevel: Infinity },
  { id: "fusion",     name: "Fusion Earrings",         icon: "💍", desc: "Combine power with another warrior.",                   kind: "globalMult",   value: 5,    baseCost: 100000,   maxLevel: 1 },
  { id: "gravity10",  name: "10× Gravity",             icon: "🌍", desc: "Train under ten times Earth's gravity.",                kind: "passiveFlat",  value: 50,   baseCost: 8000,     maxLevel: Infinity },
  { id: "gravity100", name: "100× Gravity",            icon: "🌑", desc: "Push your body far beyond normal limits.",              kind: "passiveFlat",  value: 175,  baseCost: 60000,    maxLevel: Infinity },
  { id: "gravity500", name: "500× Gravity",            icon: "🪐", desc: "Only the strongest warriors survive this training.",    kind: "passiveFlat",  value: 400,  baseCost: 300000,   maxLevel: Infinity },
  { id: "angel",      name: "Angel Guidance",          icon: "😇", desc: "Receive training from an angel.",                       kind: "globalMult",   value: 10,   baseCost: 1000000,  maxLevel: 1 },
  { id: "spiritbomb", name: "Spirit Bomb",             icon: "🌟", desc: "Gather energy from living beings across the universe.", kind: "globalMult",   value: 25,   baseCost: 5000000,  maxLevel: 1, special: true },
  { id: "godki",      name: "God Ki",                  icon: "✨", desc: "Unlock divine energy.",                                 kind: "globalMult",   value: 100,  baseCost: 50000000, maxLevel: 1 }
];

// check krijgt het Game-object mee
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
