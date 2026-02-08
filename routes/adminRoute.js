const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment");


// router.get("/admin",authAdmin ,async (req, res) => {
//   try {
//     const payments = await Payment.find().sort({ createdAt: -1 });

//     const totalTxn = payments.length;
//     const successTxn = payments.filter(p => p.status === "SUCCESS");
//     const failedTxn = payments.filter(p => p.status === "FAILED");

//     const totalAmount = successTxn.reduce((sum, p) => sum + p.amount, 0);

//     res.render("dashbord", {
//       totalTxn,
//       successCount: successTxn.length,
//       failedCount: failedTxn.length,
//       totalAmount,
//       payments
//     });
//   } catch (err) {
//     res.send("Error loading admin panel");
//   }
// });

module.exports = router;