const express = require("express");
const router = express.Router();
const url = require('url');
const { check, validationResult } = require('express-validator');
const {
    makeBidding,
    findWinnerBidder
} = require('../config/db');

async function createBidding(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }
    try {
        const bidderObject = await makeBidding(req.body.auction_id, req.body.bidder_id, req.body.amount);
        res.json(bidderObject)
    } catch (e) {
        res.status(500).send(e.message)
    }
}
async function showWinner(req, res) {
    try {
        const auction_id = url.parse(req.url, true).query.auction_id;
        const bidderObject = await findWinnerBidder(auction_id);
        if (bidderObject)
            res.json(bidderObject)
        else
            res.send("No Biddings Won")
    } catch (e) {
        res.status(500).send(e.message)
    }
}
router.post('/makeBidding', [
    check('auction_id').isLength({ min: 5 }),
    check('bidder_id').isLength({ min: 5 }),
    check('amount').isDecimal(),
], createBidding)
router.get('/winner', showWinner)

module.exports = router;