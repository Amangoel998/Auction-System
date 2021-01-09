const mongoose = require('mongoose')
const shortid = require('shortid')

const BidderSchema = new mongoose.Schema({
    bidder_name: {
        type: String,
        required: true,
    },
    bidder_id: {
        type: String,
        required: true,
        unique: true,
        default: shortid.generate
    },
    reg_auctions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "auction"
    }],
    auctions_won: [{
        auction: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "auction",
            required: true,
        },
        bid_amount: {
            type: Number,
            default: 0,
            required: true,
        }
    }]
},
    {
        collection: 'bidders'
    });
module.exports = Bidder = mongoose.model('bidder', BidderSchema);