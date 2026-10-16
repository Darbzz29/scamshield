const mongoose = require("mongoose");
const Sample = require("../models/Sample");
const { buildModel, classify } = require("../lib/classifier");

(async () => {
  await mongoose.connect("mongodb://127.0.0.1:27017/ScamShield");
  const s = await Sample.find().lean();
  let tp = 0, tn = 0, fp = 0, fn = 0;
  s.forEach((x, i) => {
    const model = buildModel(s.filter((_, j) => j !== i));
    const pred = classify(model, x.text).risk >= 50 ? "scam" : "safe";
    if (x.label === "scam") { pred === "scam" ? tp++ : fn++; }
    else { pred === "safe" ? tn++ : fp++; }
  });
  const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0) + "%";
  console.log("Leave-one-out test on", s.length, "labelled messages");
  console.log("Accuracy :", pct(tp + tn, s.length));
  console.log("Precision:", pct(tp, tp + fp), "(of messages flagged scam, how many truly were)");
  console.log("Recall   :", pct(tp, tp + fn), "(of real scams, how many were caught)");
  console.log("Confusion: caught scams", tp, "| missed scams", fn, "| false alarms", fp, "| correct safe", tn);
  await mongoose.disconnect();
})();
