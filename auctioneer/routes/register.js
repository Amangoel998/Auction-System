const express = require("express");
const router = express.Router();
const { check, validationResult } = require('express-validator');
const {
    registerBidder,
    createBidder,
    registerAuction
} = require('../config/db');

async function regAuction(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }
    try {
        const auctionObject = await registerAuction(req.body.name);
        res.json({
            auction_id: auctionObject.auction_id,
            is_open: auctionObject.is_open,
            auction_name: auctionObject.auction_name,
        })
    } catch (e) {
        res.status(500).send(e.message)
    }
}
async function regBidder(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }
    try {
        const bidderObject = await registerBidder(req.body.auction_id, req.body.bidder_id);
        if (bidderObject)
            res.send("Bidder registered for Bidding")
        else
            res.send("Bidder Already registered for Bidding")
    } catch (e) {
        res.status(500).send(e.message)
    }
}
async function makeBidder(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }
    try {
        const bidderObject = await createBidder(req.body.name);
        res.json({
            bidder_id: bidderObject.bidder_id,
            bidder_name: bidderObject.bidder_name
        })
    } catch (e) {
        res.status(500).send(e.message)
    }
}

router.post('/registerAuction', [
    check('name').isLength({ min: 5 })
], regAuction)
router.post('/createBidder', [
    check('name').isLength({ min: 5 })
], makeBidder)
router.post('/registerBidder', [
    check('auction_id').isLength({ min: 5 }),
    check('bidder_id').isLength({ min: 5 })
], regBidder)

module.exports = router;