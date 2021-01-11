const express = require("express");
const router = express.Router();
const {
    openBidding,
    closeBidding
} = require('../config/db');
async function openAuction(req, res) {
    try {
        const auction_id = req.body.auction_id
        if(auction_id){
            const auctionObject = openBidding(auction_id);
            res.json(auctionObject ? 
                'Auction Has Been Opened':
                "Auction Couldn't be Opened");
        } else res.send("Auction Id is required")
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