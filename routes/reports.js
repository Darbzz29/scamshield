const express = require("express");
const Report = require("../models/Report");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const b = req.body || {};
    const text = String(b.text || "").trim()
      .replace(/\+?\d[\d\s-]{8,}\d/g, "[number hidden]")
      .replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, "[email hidden]");
    const state = String(b.state || "").trim();
    if (text.length < 5 || text.length > 3000) return res.status(400).json({ error: "Message text is missing or too long." });
    if (!state || state.length > 40) return res.status(400).json({ error: "Choose a state." });
    const report = await Report.create({
      text,
      state,
      verdict: b.verdict,
      risk: Number(b.risk) || 0,
      redFlags: Array.isArray(b.redFlags) ? b.redFlags.slice(0, 10).map(String) : [],
      source: "user"
    });
    res.status(201).json(report);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/stats", async (req, res) => {
  try {
    const [r] = await Report.aggregate([
      {
        $facet: {
          total: [{ $count: "n" }],
          byState: [
            { $group: { _id: "$state", count: { $sum: 1 } } },
            { $sort: { count: -1, _id: 1 } }
          ],
          topFlags: [
            { $unwind: "$redFlags" },
            { $group: { _id: "$redFlags", count: { $sum: 1 } } },
            { $sort: { count: -1, _id: 1 } },
            { $limit: 8 }
          ],
          bySource: [{ $group: { _id: { $ifNull: ["$source", "user"] }, count: { $sum: 1 } } }]
        }
      }
    ]);
    res.json({
      total: r.total[0] ? r.total[0].n : 0,
      byState: r.byState.map((x) => ({ state: x._id, count: x.count })),
      topFlags: r.topFlags.map((x) => ({ word: x._id, count: x.count })),
      bySource: r.bySource.map((x) => ({ source: x._id, count: x.count }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const q = String(req.query.q || "").trim();
    const reports = q
      ? await Report.find({ $text: { $search: q } }, { score: { $meta: "textScore" } }).sort({ score: { $meta: "textScore" } }).limit(30).lean()
      : await Report.find().sort({ createdAt: -1 }).limit(30).lean();
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
