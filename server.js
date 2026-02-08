require("dotenv").config();
const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const mongoose = require("mongoose");
const path = require("path");

const Payment = require("./models/paymentModel");
const connectDB = require("./models/db");

connectDB();
const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));

// razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET
});

// routes
app.get("/", (req, res) => {
  res.redirect("/donate");
});

app.get("/donate", (req, res) => {
  res.render("donate", {
    key: process.env.RAZORPAY_KEY_ID
  });
});

// create order
app.post("/create-order", async (req, res) => {
  try {
    const amount = Number(req.body.amount);
    if (isNaN(amount) || amount < 100) {
      return res.status(500).json({ error: "Invalid amount. Minimum is ₹100." });
    }
    console.log("creating order for amount:", amount);

    console.log("amount grater then 99");
    
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR"
    });
console.log("order created");

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Order creation failed" });
  }
});

// verify payment
app.post("/verify-payment", async (req, res) => {
  console.log("verifying payment");
  
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    amount
  } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    const payment = await Payment.create({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      amount
    });
    console.log("payment verified and saved to db");
    res.json({ success: true, id: payment._id });
  } else {
    res.json({ success: false });
  }
});

app.get("/success/:id", async (req, res) => {
  const payment = await Payment.findById(req.params.id);
  console.log("payment successful");
  res.render("success", { payment });
});

app.get("/failed", (req, res) => {
  console.log("payment failed");
  res.render("failed");
});
// app.post("/mock-success", async (req, res) => {
//   const payment = await Payment.create({
//     orderId: "MOCK_ORDER",
//     paymentId: "MOCK_PAYMENT",
//     signature: "MOCK",
//     amount: req.body.amount,
//     status: "SUCCESS"
//   });

//   res.json({ id: payment._id });
// });



app.listen(3000, () => {
  console.log("Server running on port 3000");
});
