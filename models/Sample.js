const mongoose = require("mongoose");

const sampleSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    label: { type: String, enum: ["scam", "safe"], required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sample", sampleSchema);
