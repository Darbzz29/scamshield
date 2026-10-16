const Sample = require("../models/Sample");

function tokenize(text) {
  return String(text)
    .toLowerCase()
    .replace(/https?:\/\/\S+|www\.\S+/g, " urltoken ")
    .replace(/\d{10,}/g, " longnumber ")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1);
}

function buildModel(samples) {
  const model = { docs: { scam: 0, safe: 0 }, words: { scam: {}, safe: {} }, total: { scam: 0, safe: 0 }, vocab: new Set() };
  for (const s of samples) {
    model.docs[s.label]++;
    for (const w of tokenize(s.text)) {
      model.words[s.label][w] = (model.words[s.label][w] || 0) + 1;
      model.total[s.label]++;
      model.vocab.add(w);
    }
  }
  return model;
}

async function train() {
  const samples = await Sample.find().lean();
  const model = { docs: { scam: 0, safe: 0 }, words: { scam: {}, safe: {} }, total: { scam: 0, safe: 0 }, vocab: new Set() };
  for (const s of samples) {
    model.docs[s.label]++;
    for (const w of tokenize(s.text)) {
      model.words[s.label][w] = (model.words[s.label][w] || 0) + 1;
      model.total[s.label]++;
      model.vocab.add(w);
    }
  }
  return model;
}

function classify(model, text) {
  const tokens = [...new Set(tokenize(text))];
  const V = model.vocab.size || 1;
  const n = model.docs.scam + model.docs.safe;
  let scam = Math.log((model.docs.scam + 1) / (n + 2));
  let safe = Math.log((model.docs.safe + 1) / (n + 2));
  const clues = [];

  for (const w of tokens) {
    if (!model.vocab.has(w)) continue;
    const ps = Math.log(((model.words.scam[w] || 0) + 1) / (model.total.scam + V));
    const ph = Math.log(((model.words.safe[w] || 0) + 1) / (model.total.safe + V));
    scam += ps;
    safe += ph;
    clues.push({ word: w, weight: ps - ph });
  }

  const risk = 1 / (1 + Math.exp(safe - scam));
  const verdict = risk >= 0.7 ? "Likely scam" : risk >= 0.4 ? "Suspicious" : "Looks safe";
  const redFlags = clues.filter((c) => c.weight > 0.6).sort((a, b) => b.weight - a.weight).slice(0, 6).map((c) => c.word);
  return { verdict, risk: Math.round(risk * 100), redFlags };
}

module.exports = { train, classify, buildModel };

