const express = require('express');
const { authMiddleware } = require('../middleware');
const { Account } = require('../db');
const { default: mongoose } = require('mongoose');

const router = express.Router();

router.get("/balance", authMiddleware, async (req, res) => {

    const account = await Account.findOne({
        userId: req.userId
    })
    res.json({
        balance: account.balance
    })
})

router.post('/transfer', authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();
    console.log("Account.js is working")
    session.startTransaction();
    try {
        const { amount, to } = req.body;

        //   fetch the account within the transaction
        const account = await Account.findOne({
            userId: req.userId
        }).session(session);

        if (!account || account.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Insufficient balance"
            })
        }
        // Fetch the recipient's account within the transaction
        const toAccount = await Account.findOne({
            userId: to
        }).session(session);
        if (!toAccount) {
            await session.abortTransaction();
            return res.status(404).json({
                message: "Account not found"
            })
        }

        // perform the transfer

        await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
        await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

        // commit the transaction
        await session.commitTransaction();
        res.json({
            message: "Transfer successfull"
        })
    } catch (error) {
        await session.abortTransaction(); // Abort transaction on error
        console.error("Error during transfer:", error);
        res.status(500).json({ message: "Transfer failed due to a server error" });
    } finally {
        session.endSession(); // Ensure session is properly closed
    }
})
module.exports = router;