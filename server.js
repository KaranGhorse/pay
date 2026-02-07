const express = require("express");
const Razorpay = require("razorpay");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET
});

app.get("/", (req, res) => {
  res.redirect("/donate");
});

app.get("/donate", (req, res) => {
  res.render("donate");
});

app.post("/create-order", async (req, res) => {
  try {
    const amount = Number(req.body.amount);

    if (!amount || amount < 100) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR"
    });

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Order creation failed" });
  }
});
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
