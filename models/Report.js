const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true, maxlength: 3000 },
    state: { type: String, required: true, trim: true, maxlength: 40 },
    verdict: { type: String, enum: ["Likely scam", "Suspicious", "Looks safe"], default: "Likely scam" },
    risk: { type: Number, min: 0, max: 100, default: 0 },
    redFlags: { type: [String], default: [] },
    source: { type: String, enum: ["user", "sample"], default: "user" }
  },
  { timestamps: true }
);

reportSchema.index({ text: "text" });
reportSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 });

module.exports = mongoose.model("Report", reportSchema);
