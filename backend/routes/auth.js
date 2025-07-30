const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // ⬅️ NEW
const router = express.Router();
require('dotenv').config();

const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = '1d'; // 1 day or change as needed

// @route   POST /api/auth/signup
// @desc    Register new user
router.post('/signup', async (req, res) => {
    const { name, email, password, userType } = req.body;

    if (!name || !email || !password || !userType) {
        return res.status(400).json({ message: 'Please fill all fields' });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            userType
        });

        await newUser.save();

        // Create JWT token
        const token = jwt.sign({ id: newUser._id, userType: newUser.userType }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN
        });

        res.status(201).json({
            message: 'User registered successfully',
            token, // ⬅️ Return token
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                userType: newUser.userType
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user
router.post('/login', async (req, res) => {
    const { email, password} = req.body;

    if (!email || !password ) {
        return res.status(400).json({ message: 'Please provide email and password'});
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'user not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Create JWT token
        const token = jwt.sign({ id: user._id, userType: user.userType }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN
        });

        res.status(200).json({
            message: 'Login successful',
            token, // ⬅️ Return token
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                userType: user.userType
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
