const mongoose = require('mongoose');
const config = require('config');
const dbURI = config.get('mongoURI');
const { Auction, Bidding } = require('../models/Auction');
const Bidder = require('../models/Bidder');

const connectDB = async () => {
  try {
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    console.log('MongoDB Connected....');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
const registerBidder = async (auction_id, bidder_id) => {
  try {
    const found_auction = await Auction.findOne({ auction_id });
    const found_bidder = await Bidder.findOne({ bidder_id });
    if (!found_auction)
      throw new Error("Auction doesn't exists");
    if (!found_bidder)
      throw new Error("Bidder doesn't exists");
    const result1 = found_auction.reg_bidders.addToSet(found_bidder._id);
    const result2 = found_bidder.reg_auctions.addToSet(found_auction._id);
    await found_auction.save();
    await found_bidder.save();
    return result1 && result1.length > 0 ? true : false;
  } catch (e) {
    throw new Error(e);
  }
}
const openBidding = async (auction_id) => {
  try {
    const found_auction = await Auction.findOneAndUpdate({ auction_id }, { is_open: true });
    let bidder = await found_bidder.save();
    return bidder
  } catch (e) {
    throw new Error(e);
  }
}
const closeBidding = async (auction_id) => {
  try {
    const found_auction = await Auction.findOneAndUpdate({ auction_id }, { is_open: false, has_expired: true });
    let bidder = await found_bidder.save();
    return bidder
  } catch (e) {
    throw new Error(e);
  }
}
const makeBidding = async (auction_id, bidder_id, amount) => {
  try {
    const found_bidder = await Bidder.findOne({ bidder_id });
    if (found_bidder == null)
      throw new Error("Bidder doesn't exists");
    const found_auction = await Auction.findOne({ "auction_id": auction_id, "reg_bidders": found_bidder._id });
    if (found_auction == null)
      throw new Error("Auction doesn't exists");
    const duplicate_bidding = await Auction.findOne({ "auction_id": auction_id, "biddings.bidder": found_bidder._id });
    if (duplicate_bidding) {
      console.log(duplicate_bidding)
      throw new Error("Duplicate Bidding")
    }
    if (!found_auction.is_open)
      throw new Error("Bidding not opened")
    if (!found_auction.has_expired)
      throw new Error("Auction has Expired")
    const newBidding = new Bidding({ bidder: found_bidder._id, amount })
    const result = await found_auction.biddings.addToSet(newBidding);
    found_auction.save();
    return result;
  } catch (e) {
    throw new Error(e);
  }
}
const findWinnerBidder = async (auction_id) => {
  try {
    let found_auction = await Auction.findOne({ auction_id }, "biddings").select('bindings')
    if (!found_auction)
      throw new Error("Auction doesn't exists");
    found_auction = found_auction.toObject().biddings.sort((a, b) => b.amount - a.amount)[0]
    const found_bidder = await Bidder.findById(found_auction.bidder)
    if (!found_bidder)
      throw new Error("Bidder doesn't exists");
    return {
      amount: found_auction.amount,
      bidder_id: found_bidder.bidder_id,
      bidder_name: found_bidder.bidder_name
    };
  } catch (e) {
    throw new Error(e);
  }
}
const createBidder = async (bidder_name) => {
  try {
    const found_bidder = new Bidder({ bidder_name });
    let bidder = await found_bidder.save();
    return bidder
  } catch (e) {
    throw new Error(e);
  }
}
const registerAuction = async (auction_name) => {
  try {
    const newAuction = new Auction({ auction_name });
    let auction = await newAuction.save();
    return auction
  } catch (e) {
    throw new Error(e);
  }
}
const listRegisteredAuctions = async (bidder_id) => {
  try {
    const found_auctions = await Bidder.findOne({ bidder_id })
    if (found_auctions) {
      await found_auctions.populate({ path: 'reg_auctions', select: 'auction_id auction_name' }).execPopulate()
    }
    else throw new Error("Not registered in any Auctions");
    const result = found_auctions.reg_auctions;
    return result;
  } catch (e) {
    throw new Error(e);
  }
}
const listRegisteredBidders = async (auction_id) => {
  try {
    let found_auctions = await Auction.findOne({ auction_id });
    let found_bidders;
    if (found_auctions) {
      found_bidders = await found_auctions.populate({ path: 'reg_bidders', select: 'bidder_id bidder_name' }).execPopulate()
    } else {
      throw new Error("No Object By that Id");
    }
    if (found_bidders) {
      return found_bidders.reg_bidders
    } else return null;
  } catch (e) {
    throw new Error(e);
  }
}
const listAllAuctions = async () => {
  try {
    const found_auctions = await Auction.find({}, { __v: 0 });
    return found_auctions
  } catch (e) {
    throw new Error(e);
  }
}
const listAllBidders = async (bidder_username) => {
  try {
    const found_bidder = await Bidder.findOne({ bidder_username });
    return found_bidder
  } catch (e) {
    throw new Error(e);
  }
}
module.exports = {
  connectDB,
  registerBidder,
  createBidder,
  makeBidding,
  registerAuction,
  listAllAuctions,
  listAllBidders,
  listRegisteredBidders,
  listRegisteredAuctions,
  openBidding,
  closeBidding,
  findWinnerBidder
};
