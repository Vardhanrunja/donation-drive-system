// routes/donations.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth')
const Donation = require('../models/Donation');

// @route   POST /api/donations/add
// @desc    Donor adds a new donation
router.post('/add', authMiddleware('donor'), async (req, res) => {
    const {
        itemName,
        itemType,
        quantity,
        description,
        pickupAddress,
        pickupDateTime
    } = req.body;
    const donor = req.user.id;

    if (!itemName || !itemType || !quantity || !pickupAddress || !pickupDateTime) {
        return res.status(400).json({ message: 'Please fill all required fields' });
    }

    try {
        const donation = new Donation({
            donor,
            itemName,
            itemType,
            quantity,
            description,
            pickupAddress,
            pickupDateTime
        });

        await donation.save();
        res.status(201).json({ message: 'Donation added successfully', donation });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/donations/available
// @desc    Get donations that are pending and not assigned to any NGO
router.get('/available',authMiddleware(), async (req, res) => {
    try {
        const donations = await Donation.find({ status: 'pending', ngo: null }).sort({ createdAt: -1 });
        res.status(200).json(donations);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/donations/claim
// @desc    NGO claims a donation
router.post('/claim', authMiddleware('ngo'), async (req, res) => {
    const { donationId} = req.body;
    const ngoId = req.user.id;
    if (!donationId) {
        return res.status(400).json({ message: 'Missing donation ID' });
    }

    try {
        const donation = await Donation.findById(donationId);
        if (!donation || donation.status !== 'pending') {
            return res.status(400).json({ message: 'Donation not available' });
        }

        donation.ngo = ngoId;
        donation.status = 'approved';
        await donation.save();

        res.status(200).json({ message: 'Donation claimed successfully', donation });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/donations/update-status
// @desc    NGO updates status of donation
router.put('/update-status/:donationId',authMiddleware('ngo'), async (req, res) => {
    const { status } = req.body;
    const donationId = req.params.donationId;

    if (!status) {
        return res.status(400).json({ message: 'Missing donation ID or status' });
    }

    const allowedStatuses = ['approved', 'collected', 'delivered', 'rejected'];
    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
    }

    try {
        const donation = await Donation.findById(donationId);
        if (!donation) {
            return res.status(404).json({ message: 'Donation not found' });
        }

        donation.status = status;
        donation.ngo = req.user.id;
        await donation.save();

        res.status(200).json({ message: 'Donation status updated', donation });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/donations/ngo/:ngoId
// @desc    Get donations assigned to a specific NGO
router.get('/ngo', authMiddleware('ngo'), async (req, res) => {
    try {
        const ngoId = req.user.id;
        const donations = await Donation.find({ ngo: ngoId }).sort({ createdAt: -1 });
        res.json(donations);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});


// @route   GET /api/donations/donor/:donorId
// @desc    Get donations submitted by a specific donor
router.get('/donor',authMiddleware('donor'), async (req, res) => {
    try {
        const donations = await Donation.find({ donor: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(donations);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/donations/stats
// @desc    Get stats for donor dashboard
router.get('/stats', authMiddleware('donor'), async (req, res) => {
    try {
        const donorId = req.user.id;
        const total = await Donation.countDocuments({ donor: donorId });
        const pending = await Donation.countDocuments({ donor: donorId, status: 'pending' });
        const completed = await Donation.countDocuments({ donor: donorId, status: 'delivered' });

        res.json({
            totalDonations: total,
            pendingDonations: pending,
            completedDonations: completed
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/donations/recent
// @desc    Get recent donations by donor
router.get('/recent', authMiddleware('donor'), async (req, res) => {
    try {
        const recent = await Donation.find({ donor: req.user.id })
            .sort({ createdAt: -1 })
            .limit(5);
        res.json(recent);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/donations/ngo-stats
// @desc    Get stats for NGO dashboard
router.get('/ngo-stats', authMiddleware('ngo'), async (req, res) => {
    try {
        const ngoId = req.user.id;

        const pending = await Donation.countDocuments({ ngo: null, status: 'pending' });
        const approved = await Donation.countDocuments({ ngo: ngoId, status: 'approved' });
        const collected = await Donation.countDocuments({ ngo: ngoId, status: 'collected' });
        const delivered = await Donation.countDocuments({ ngo: ngoId, status: 'delivered' });

        res.json({
            pendingRequests: pending,
            totalReceived: approved,
            collectedCount: collected,
            completedDonations: delivered
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;
