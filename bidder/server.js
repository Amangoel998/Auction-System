const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const { registerItself, registerBidding, getRegisteredAuctions } = require('./config/db')
app.use(bodyParser.json({ limit: '10mb' }));

app.get("/", (req, res) => res.status(200));

registerItself();
app.post("/registerToAuction", async (req, res) => {
    try {
        if (req.body.auction_id){
            const result = await registerBidding(req.body.auction_id);
            console.log(result)
            res.send(result)
        }
    } catch (e) {
        res.status(500).send(e.message)
    }
});
app.get("/getRegisteredAuctions", async (req, res) => {
    try {
        const result = await getRegisteredAuctions();
        console.log(result)
        res.json(result)
    } catch (e) {
        res.status(500).send(e.message)
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server started on PORT: ${PORT}`));
