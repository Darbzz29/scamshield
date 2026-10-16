const mongoose = require("mongoose");
const Report = require("../models/Report");
const { train, classify } = require("../lib/classifier");

const texts = [
  "SBI ALERT: Your YONO account is blocked due to pending KYC. Update now at http://yono-sbi-kyc.xyz or account will be closed in 24 hrs.",
  "Dear customer, your electricity connection will be disconnected tonight at 9.30 PM as previous month bill is not updated. Contact officer on 98XXXXXXXX immediately.",
  "Congratulations! Your number won Rs 25,00,000 in the WhatsApp Lucky Draw. Pay Rs 5,000 tax to claim your prize.",
  "Part time job offer: earn Rs 3000-8000 daily from home. Just like and subscribe videos. Join our Telegram channel now http://t-earn-job.top",
  "Your DHL parcel is on hold due to incomplete address. Pay Rs 39 redelivery fee at http://dhl-redeliver.online",
  "Dear user, your PAN card is not linked with Aadhaar. Your account will be freezed today. Update now http://pan-aadhaar-link.xyz",
  "Instant personal loan up to Rs 5 lakh approved! No CIBIL check. Pay Rs 2000 processing fee to receive the amount in 10 mins.",
  "Your credit card has 8450 reward points expiring today. Redeem them now at http://card-rewards-claim.top",
  "This is cyber crime branch. A parcel in your name contains illegal items. Call us immediately or you will be arrested.",
  "Hi, we are hiring for Amazon product review task. Earn commission on every task. Pay Rs 1000 deposit to unlock withdrawal.",
  "Your Gas connection will be cancelled. Verify your consumer number and share the OTP to continue the service.",
  "Free Rs 599 recharge offer for all users. Click here to claim http://free-recharge-jio.online and enter your UPI pin",
  "Dear student, you are eligible for government scholarship of Rs 30,000. Share your bank account and OTP to receive the amount.",
  "Sir, I sent Rs 15000 to your number by mistake. Please return it urgently to this UPI ID, my child is in hospital.",
  "Invest Rs 10,000 and get Rs 30,000 in 7 days guaranteed. Join our crypto VIP group. Only 10 seats left.",
  "Your SIM card KYC has expired and will be blocked in 2 hours. Call 1800-XXX-XXXX to update details immediately.",
  "Income tax department: you have a pending refund of Rs 24,560. Submit your card details at http://itr-refund-claim.xyz",
  "Last warning! Your Netflix subscription has failed. Update payment details within 12 hours at http://netflix-billing-update.top",
  "Congratulations, you have been shortlisted for a work from home job at Flipkart. Salary Rs 45,000. Pay Rs 1500 for ID card.",
  "Your WhatsApp account will expire. Click http://whatsapp-verify-now.online to verify within 1 hour to avoid ban."
];
const states = ["Maharashtra", "Karnataka", "Tamil Nadu", "Delhi", "Uttar Pradesh", "Telangana", "Gujarat", "Kerala", "West Bengal", "Rajasthan", "Bihar", "Assam", "Odisha", "Goa", "Punjab", "Maharashtra", "Karnataka", "Delhi", "Tamil Nadu", "Uttar Pradesh"];
const day = 24 * 60 * 60 * 1000;

(async () => {
  await mongoose.connect("mongodb://127.0.0.1:27017/ScamShield");
  await Report.deleteMany({ source: "sample" });
  const model = await train();
  const docs = texts.map((text, i) => {
    const r = classify(model, text);
    return { text, state: states[i], verdict: r.verdict, risk: r.risk, redFlags: r.redFlags, source: "sample", createdAt: new Date(Date.now() - (i + 1) * day) };
  });
  await Report.insertMany(docs);
  console.log("Added", docs.length, "sample reports (labelled Sample)");
  await mongoose.disconnect();
})();
