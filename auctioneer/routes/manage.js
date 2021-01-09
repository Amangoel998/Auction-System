const express = require("express");
const router = express.Router();
const {
    openBidding,
    closeBidding
} = require('../config/db');
async function openAuction(req, res) {
    try {
        const auctionObject = await openBidding();
        res.json(auctionObject ? 
            'Auction Has Been Opened':
            "Auction Couldn't be Opened");
    } catch (e) {
        res.status(404).send("Auction Couldn't be Opened")
    }
}
async function closeAuction(req, res) {
    try {
        const auctionObject = await closeBidding();
        res.json(auctionObject ?
            "Auction Closed":
            "Auction Couldn't be Closed");
    } catch (e) {
        res.status(404).send("Auction Couldn't be Closed")
    }
}
router.put('/openAuction', openAuction)
router.put('/closeAuction', closeAuction)

module.exports = router;