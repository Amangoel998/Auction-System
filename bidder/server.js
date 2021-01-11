const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const url = require('url');
const { registerItself,
    registerBidding,
    getRegisteredAuctions,
    makeBidInAuction,
    makeBid
} = require('./config/db')


app.use(bodyParser.json({ limit: '10mb' }));

app.get("/", (req, res) => res.status(200));
app.post("/registerToAuction", async (req, res) => {
    try {
        if (req.body.auction_id) {
            const result = await registerBidding(req.body.auction_id);
            res.send(result);
        }
    } catch (e) {
        res.status(500).send(e.message)
    }
});
app.get("/getRegisteredAuctions", async (req, res) => {
    try {
        const result = await getRegisteredAuctions();
        res.json(result);
    } catch (e) {
        res.status(500).send(e.message)
    }
});
app.post("/makeBid", async (req, res) => {
    try {
        const result = await makeBid(req.body.auction_id, req.body.amount, req.body.timems);
        res.status(200).send(result);
    } catch (e) {
        res.status(500).send(e.message)
    }
});
app.get("/bidInAuction", async (req, res) => {
    try {
        const auction_id = url.parse(req.url, true).query.auction_id;
        const result = await makeBidInAuction(auction_id);
        res.json(result);
    } catch (e) {
        res.status(500).send(e.message)
    }
});

const PORT = process.env.PORT || 3001;
const listener = app.listen(PORT, () => console.log(`Server started on PORT: ${PORT}`));

registerItself(listener.address());