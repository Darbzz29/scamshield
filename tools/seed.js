const mongoose = require("mongoose");
const Sample = require("../models/Sample");

const data = [
  ["scam", "Congratulations! You have won Rs 25,00,000 in the KBC lottery. Send your bank details and pay processing fee to claim the prize."],
  ["scam", "Dear customer your SBI account will be blocked today. Update your KYC immediately by clicking http://sbi-kyc-update.xyz"],
  ["scam", "Work from home job! Earn Rs 5000 daily by liking YouTube videos. No experience needed. Message us on Telegram now."],
  ["scam", "Your electricity will be disconnected tonight at 9:30 pm because previous bill is not updated. Call this number immediately."],
  ["scam", "Urgent: your UPI is suspended. Share the OTP you received to reactivate your account."],
  ["scam", "You have been selected for part time job. Pay registration fee of Rs 999 to confirm your appointment letter."],
  ["scam", "Get instant loan Rs 50000 without documents. Pay Rs 1500 insurance fee first and loan will be sent in 5 minutes."],
  ["scam", "Your parcel is held at customs. Pay Rs 49 delivery charge at this link http://post-india-track.top to release it."],
  ["scam", "Dear user your Aadhaar is linked to illegal activity. Cyber police will arrest you. Call this number to settle the case."],
  ["scam", "Free recharge offer! Click the link and enter your UPI pin to receive Rs 599 cashback."],
  ["scam", "Hi I am HR from Amazon. We are hiring for data entry. Salary 40000 per month. Send Rs 2000 deposit for laptop."],
  ["scam", "Your credit card reward points will expire today. Redeem now at http://hdfc-rewards-claim.in or lose Rs 9800."],
  ["scam", "Investment guaranteed double your money in 7 days. Join our WhatsApp group for crypto signals. Limited seats."],
  ["scam", "Your SIM will be deactivated in 2 hours. Verify Aadhaar and send OTP to avoid disconnection."],
  ["scam", "Final notice: income tax refund of Rs 18540 is pending. Submit your bank account and card number to receive it."],
  ["scam", "Dear student you won a scholarship of Rs 50000. Click the link and enter your bank password to receive the amount."],
  ["scam", "I accidentally sent money to your account. Please send it back to this number urgently, I am in emergency."],
  ["scam", "Earn money online by rating hotels. First task free, then pay Rs 3000 to unlock the next task and get commission."],
  ["scam", "Your WhatsApp will be banned. Forward this message to 10 contacts and click the link to verify your number."],
  ["scam", "Lucky draw winner! You won an iPhone 15. Pay Rs 499 shipping fee and share your card details to claim."],
  ["scam", "Bank alert: suspicious login detected. Your net banking will be locked. Login now at http://secure-bank-verify.online"],
  ["scam", "Casino bonus! Deposit Rs 1000 and get Rs 10000 free. Withdraw instantly. Click now before offer ends."],
  ["scam", "Dear sir your electricity meter KYC is pending. Download the apk file from this link to update, otherwise power cut."],
  ["scam", "Hello, this is customer care. Install AnyDesk app so we can fix your refund problem. Tell us the code you see."],
  ["safe", "Hey are you coming for the class tomorrow? The professor said the assignment is due on Friday."],
  ["safe", "Your OTP for login is 482913. Do not share this code with anyone. It is valid for 10 minutes."],
  ["safe", "Reminder: team meeting at 4 pm today in the seminar hall. Please bring your laptops."],
  ["safe", "Happy birthday! Hope you have an amazing day. Let's go out for dinner this weekend."],
  ["safe", "Your order has been shipped and will arrive by Thursday. You can track it in the app under My Orders."],
  ["safe", "Can you send me the notes from yesterday's lecture? I was absent because of a fever."],
  ["safe", "Mom called, she said dinner is ready and dad will pick you up from the station at 8."],
  ["safe", "The hackathon registration closes on Sunday. Please submit your team details through the official form."],
  ["safe", "Thanks for the help with the project. I have pushed the code to GitHub, please review it when free."],
  ["safe", "Your electricity bill for September is generated. You can pay it on the official app before the due date."],
  ["safe", "Bus leaves at 7 am tomorrow from the main gate. Please be on time and carry your ID card."],
  ["safe", "Lunch at the canteen today? I will save a table near the window."],
  ["safe", "Your exam hall ticket is now available on the university portal. Download it before Monday."],
  ["safe", "Meeting rescheduled to Wednesday 11 am. Agenda is attached in the email I sent earlier."],
  ["safe", "Rs 450 debited from your account for the grocery purchase. If this was not you, please call the number on the back of your card."],
  ["safe", "Did you see the match last night? That last over was unbelievable."],
  ["safe", "The library will remain closed on Saturday for maintenance. Books can be returned on Monday."],
  ["safe", "Please find the interview schedule attached. Kindly confirm your slot by replying to this email."],
  ["safe", "Just reached home safely. Will call you after dinner. Good night!"],
  ["safe", "Your appointment with Dr Rao is confirmed for 5 pm tomorrow. Please carry your previous reports."],
  ["safe", "Reminder to submit the lab record before the end of this week. No extension will be given."],
  ["safe", "Can we change the project demo to Tuesday? I have a clash with my other class on Monday."],
  ["safe", "Thank you for registering. Your event pass has been sent to your college email address."],
  ["safe", "Movie tonight at 8? I booked three tickets, just let me know if you can make it."]
];

(async () => {
  await mongoose.connect("mongodb://127.0.0.1:27017/ScamShield");
  await Sample.deleteMany({});
  await Sample.insertMany(data.map(([label, text]) => ({ label, text })));
  console.log("Seeded", data.length, "labelled messages");
  await mongoose.disconnect();
})();
