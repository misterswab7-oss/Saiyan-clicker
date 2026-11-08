/* Config: upgrades voor de shop */

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
