
// const bcrypt = require("bcryptjs")
const express = require('express');
const router = express.Router();
const zod = require("zod");
const { User, Account } = require("../db");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("../middleware");


const JWT_SECRET = process.env.JWT_KEY;
console.log(JWT_SECRET)

const signupBody = zod.object({
    username: zod.string().email(),
    password: zod.string().min(6),
    firstName: zod.string().min(3).max(50),
    lastName: zod.string().min(3).max(50),
})

router.post("/signup", async (req, res) => {

    const { success } = signupBody.safeParse(req.body)

    if (!success) {
        return res.status(404).json({
            message: "User Doesn't exist"
        })
    }
    // const {username, password, firstName, lastName} = signUp.parse(req.body)
    // const salt = await bcrypt.genSalt(10)
    // const hashedPassword = await bcrypt.hash(password, salt)
    // res.send({username, password, firstName, lastName})

    const existingUser = await User.findOne({
        username: req.body.username
    })
    if (existingUser) {
        return res.status(400).send("Username already exists")
    }
    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName
    })

    const userId = user._id

    // -------create New Account-----------

    await Account.create({
        userId,
        balance: 1 + Math.random() * 1000
    })

    const token = jwt.sign({ userId }, JWT_SECRET);

    res.json({
        message: "User created",
        token
    })

})

const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string()
})

router.post("/signin", async (req, res) => {
    const { success } = signinBody.safeParse(req.body)
    if (!success) {
        res.status(411).json({
            mesage: "Email already taken"
        })
    }
    const user = await User.findOne({
        username: req.body.username
    })

    if (user.password !== req.body.password) { 
        return res.status(401).json({
            message: "Invalid Password"
        })
    }

    if (user) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET)

        return res.json({
            token: token
        })
    } else {
        res.status(411).json({
            message: "Error while logging in"
        })
    }

    
})

const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional()
})

router.put("/", authMiddleware, async (req, res) => {
    const { success } = updateBody.safeparse(req.body)
    if (!success) {
        res.status(411).json({
            message: "Error while uploading Information"

        })
    }
    await User.updateOne(req.body, {
        _id: req.userId
    })
    res.json({
        message: "Update Successfully"
    })
})

router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";
    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user =>({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })

})

module.exports = router

