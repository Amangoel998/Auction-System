const mongoose = require('mongoose')
const shortid = require('shortid')

const BiddingSchema = new mongoose.Schema({
    bidder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "bidder",
        required: true,
    },
    amount: {
        type: Number,
        default: 0,
        required: true,
    }
});
const AuctionSchema = new mongoose.Schema({
    auction_id: {
        type: String,
        required: true,
        unique: true,
        default: shortid.generate
    },
    auction_name: {
        type: String,
        required: true,
    },
    is_open: {
        type: Boolean,
        default: false
    },
    has_expired: {
        type: Boolean,
        default: false
    },
    reg_bidders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "bidder"
    }],
    auction_winner: BiddingSchema,
    biddings: [BiddingSchema]
},
    {
        collection: 'auctions'
    });
module.exports = {
    Auction: mongoose.model('auction', AuctionSchema),
    Bidding: mongoose.model('bidding', BiddingSchema)
}