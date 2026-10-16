const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (req, res) => {
  res.json({ ok: true, db: mongoose.connection.name });
});

app.use("/api/check", require("./routes/check"));
app.use("/api/reports", require("./routes/reports"));

mongoose
  .connect("mongodb://127.0.0.1:27017/ScamShield")
  .then(async () => {
    await require("./models/Report").init();
    console.log("MongoDB connected");
    app.listen(3001, () => console.log("Running at http://localhost:3001"));
  })
  .catch((err) => {
    console.error("MongoDB error:", err.message);
    process.exit(1);
  });
