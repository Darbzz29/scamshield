# ScamShield

Paste an SMS or WhatsApp message and see how likely it is to be a scam. Users can report scam messages, and a dashboard shows reports by state and the most common red-flag words.

## Features
- Naive Bayes text classifier written in plain JavaScript, trained on labelled messages stored in MongoDB
- Risk score, verdict and the red-flag words highlighted inside the message
- Community reports with phone numbers and emails masked automatically
- Dashboard built with a MongoDB aggregation ($facet, $group, $unwind)
- Text index for searching reports
- TTL index that deletes reports after 90 days
- Leave-one-out evaluation script for accuracy, precision and recall

## Data
The training set is a small hand-labelled demo set. The dashboard shows a mix of user reports and clearly labelled sample messages. Accuracy numbers come from `node tools/evaluate.js` and apply to this small set only.

## Tech stack
Node.js, Express, MongoDB, Mongoose, vanilla JavaScript

## Run it
1. Install Node.js and MongoDB, and start MongoDB locally
2. `npm install`
3. `node tools/seed.js` (loads the training set)
4. `node tools/seed-samples.js` (optional sample reports)
5. `node server.js`
6. Open http://localhost:3001
