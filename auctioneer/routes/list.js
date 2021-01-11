const express = require("express");
const router = express.Router();
const url = require('url');
const {
    listAllAuctions,
    listAllBidders,
    listRegisteredBidders,
    listRegisteredAuctions
} = require('../config/db');


async function showAllBidders(req, res) {
    try {
        const bidderObject = await listAllBidders();
        res.json(bidderObject ? bidderObject.map(a => {
            return {
                bidder_username: a.bidder_username,
                reg_auctions: a.reg_auctions,
                auctions_won: a.auctions_won,
            }
        }) : [])
    } catch (e) {
        res.status(500).send(e.message)
    }
}
async function showRegisteredBidders(req, res) {
    try {
        const auction_id = url.parse(req.url, true).query.auction_id;
        const bidderObject = await listRegisteredBidders(auction_id);
        res.json(bidderObject ?
            bidderObject.map(a => {
                return {
                    bidder_id: a.bidder_id,
                    bidder_name: a.bidder_name,
                }
            })
            : [])
    } catch (e) {
        res.status(500).send(e.message)
    }
}
async function showRegisteredAuctions(req, res) {
    try {
        const bidder_id = url.parse(req.url, true).query.bidder_id;
        const auctionObject = await listRegisteredAuctions(bidder_id);
        res.json(auctionObject ?
            auctionObject.map(a => {
                return {
                    auction_id: a.auction_id,
                    auction_name: a.auction_name,
                }
            })
            : [])
    } catch (e) {
        res.status(500).send(e.message)
    }
}
async function showAllAuctions(req, res) {
    try {
        const auctionObject = await listAllAuctions();
        res.json(auctionObject ? auctionObject.map(a => {
            return {
                auction_id: a.auction_id,
                is_open: a.is_open,
                auction_name: a.auction_name,
            }
        }) : []);
    } catch (e) {
        res.status(500).send(e.message)
    }
}
router.get('/auctions', showAllAuctions)
router.get('/bidders', showAllBidders)
router.get('/registeredBidders', showRegisteredBidders)
router.get('/registeredAuctions', showRegisteredAuctions)

module.exports = router;