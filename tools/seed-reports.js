const mongoose = require("mongoose");
const Report = require("../models/Report");
const { train, classify } = require("../lib/classifier");

const texts = [
  "Dear customer your SBI account will be blocked today. Update your KYC immediately at http://sbi-kyc-update.xyz",
  "Congratulations! You won Rs 25,00,000 in the KBC lottery. Pay processing fee to claim your prize.",
  "Work from home job! Earn Rs 5000 daily by liking videos. Pay Rs 999 registration fee to start.",
  "Your electricity will be disconnected tonight. Call this number immediately to update your bill.",
  "Urgent: your UPI is suspended. Share the OTP you received to reactivate your account.",
  "Your parcel is held at customs. Pay Rs 49 delivery charge at http://post-india-track.top",
  "Get instant loan Rs 50000 without documents. Pay Rs 1500 insurance fee first.",
  "Your Aadhaar is linked to illegal activity. Cyber police will arrest you. Call now to settle.",
  "Free recharge offer! Click the link and enter your UPI pin to receive Rs 599 cashback.",
  "Your SIM will be deactivated in 2 hours. Verify Aadhaar and send OTP to avoid disconnection.",
  "Income tax refund of Rs 18540 is pending. Submit your bank account and card number to receive it."
];
const states = ["Maharashtra","Maharashtra","Maharashtra","Karnataka","Karnataka","Karnataka","Tamil Nadu","Tamil Nadu","Delhi","Delhi","Uttar Pradesh","Uttar Pradesh","Gujarat","West Bengal","Telangana","Kerala","Rajasthan","Bihar","Assam","Goa"];
const pick = (a) => a[Math.floor(Math.random() * a.length)];

(async () => {
  await mongoose.connect("mongodb://127.0.0.1:27017/ScamShield");
  await Report.deleteMany({});
  const model = await train();
  const day = 24 * 60 * 60 * 1000;
  const docs = [];
  for (let i = 0; i < 45; i++) {
    const text = pick(texts);
    const r = classify(model, text);
    docs.push({ text, state: pick(states), verdict: r.verdict, risk: r.risk, redFlags: r.redFlags, createdAt: new Date(Date.now() - Math.floor(Math.random() * 20) * day) });
  }
  await Report.insertMany(docs);
  console.log("Added", docs.length, "demo reports");
  await mongoose.disconnect();
})();
