const express = require("express");
const { train, classify } = require("../lib/classifier");

const router = express.Router();

router.post("/", async (req, res) => {
  const text = String((req.body && req.body.text) || "").trim();
  if (text.length < 5) return res.status(400).json({ error: "Paste a message of at least a few words." });
  if (text.length > 3000) return res.status(400).json({ error: "Message is too long (max 3000 characters)." });
  try {
    const model = await train();
    if (!model.vocab.size) return res.status(500).json({ error: "No training data. Run: node tools\\seed.js" });
    res.json(classify(model, text));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
