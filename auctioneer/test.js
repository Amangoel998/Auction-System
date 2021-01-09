const express = require('express');
const app = express();
const url = require('url');
const {
    connectDB,
    registerBidder,
    createBidder,
    makeBidding,
    registerAuction,
    listAllAuctions,
    listAllBidders,
    listRegisteredBidders,
    findWinnerBidder
} = require('./config/db');

const bodyParser = require('body-parser')
// //Connect Database
connectDB();

app.use(bodyParser.json({ limit: '10mb' }));
// //Init Middleware
// app.get("/", (req, res) => res.status(200));

// app.use("/test/register", require("./routes/register"));
// app.use("/test/list", require("./routes/list"));
// app.use("/test/bid", require("./routes/bid"));

// app.post("/test/registerBidder", async (res, req) => {
//     res.json(registerBidder(req.body.auction_id, req.body.bidder_id))
// });
app.post("/test/registerAuction", async (req, res) => {
    const auctionObject = await registerAuction(req.body.name);
    res.json({
        auction_id: auctionObject.auction_id,
        is_open: auctionObject.is_open,
        auction_name: auctionObject.auction_name,
    })
});
app.post("/test/createBidder", async (req, res) => {
    const bidderObject = await createBidder(req.body.name);
    res.json({
        bidder_id: bidderObject.bidder_id,
        bidder_name: bidderObject.bidder_name,
        reg_auctions: bidderObject.reg_auctions,
        auctions_won: bidderObject.auctions_won,
    })
});
app.post("/test/makeBidding", async (req, res) => {
    const bidderObject = await makeBidding(req.body.auction_id, req.body.bidder_id, req.body.amount);
    res.json(bidderObject)
    //     {
    //     bidder_id: bidderObject.bidder_id,
    //     bidder_name: bidderObject.bidder_name,
    //     reg_auctions: bidderObject.reg_auctions,
    //     auctions_won: bidderObject.auctions_won,
    // }
    // )
});
app.post("/test/registerBidder", async (req, res) => {
    const bidderObject = await registerBidder(req.body.auction_id, req.body.bidder_id);
    if (bidderObject)
        res.send("Bidder registered for Bidding")
    else
        res.send("Bidder Already registered for Bidding")

});
app.get("/test/bidders", async (req, res) => {
    const bidderObject = [].concat(await listAllBidders());
    res.json(bidderObject ? bidderObject.map(a => {
        return {
            bidder_name: a.bidder_name,
            reg_auctions: a.reg_auctions,
            auctions_won: a.auctions_won,
        }
    }) : [])
});
app.get("/test/auctions", async (req, res) => {
    const auctionObject = await listAllAuctions();
    res.json(auctionObject ? auctionObject.map(a => {
        return {
            auction_id: a.auction_id,
            is_open: a.is_open,
            auction_name: a.auction_name,
        }
    }) : []);
});
app.get("/test/registeredAuctions", async (req, res) => {
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
});
app.get("/test/findWinner", async (req, res) => {
    const auction_id = url.parse(req.url, true).query.auction_id;
    const bidderObject = await findWinnerBidder(auction_id);
    if (bidderObject)
        res.json(bidderObject)
    else
        res.send("No Bidding Won")
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server started on PORT: ${PORT}`));
