const config = require('nconf');
const http = require("http")

const registerItself = async (name) => {
  name = name.address+":"+name.port
  var body = JSON.stringify({name});
  config.file({ file: './default.json' });
  http.request(
    {
      hostname: "auctioneer",
      path: "/register/createBidder",
      port: 8080,
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body)
      }
    },
    res => {
      let data = ""
      res.on("data", d => {
        data += d
      })
      res.on("end", () => {
        console.log(data)
        const bidObject = JSON.parse(data);
        config.set("bidderId", bidObject.bidder_id)
      })
    }
  ).end(body)
}
const registerBidding = async (auction_id) => {
  return httprequest();
  function httprequest() {
    return new Promise((resolve, reject) => {
      var body = JSON.stringify({
        auction_id,
        bidder_id: config.get('bidderId')
      });
      http.request({
        hostname: "auctioneer",
        path: "/register/registerBidder",
        port: 8080,
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body)
        }
      }, res => {
        let data = ""
        res.on("data", d => {
          data += d
        })
        res.on("end", () => {
          resolve(data);
        })
      }).end(body);
    });
  }
}
const makeBidInAuction = async (auction_id) => {
  var conf = JSON.parse(config.get(auction_id))
  if(!conf){
    throw new Error("Not made bid")
  }
  var body = {
    bidder_id: config.get('bidderId'),
    bidder_value: conf.amount
  }
  return new Promise((resolve, reject) => {
    setTimeout(
      resolve,
      conf.timems,
      body
    );
  });
}
const getRegisteredAuctions = async () => {
  return httprequest();
  function httprequest() {
    return new Promise((resolve, reject) => {
      const bidder_id = config.get('bidderId')
      http.request({
        hostname: "auctioneer",
        path: `/list/registeredAuctions/?bidder_id=${bidder_id}`,
        port: 8080,
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
        }
      }, res => {
        let data = ""
        res.on("data", d => {
          data += d
        })
        res.on("end", () => {
          try{
            data = data?JSON.parse(data):[]
          }catch(e) {
            data = e.message
          }
          resolve(data);
        })
      }).end();
    });
  }
}
const makeBid = (auction_id, amount, timems)=>{
  config.set(auction_id, JSON.stringify({auction_id, amount, timems}));
  return "Sent Bid"
}
module.exports = {
  registerItself,
  registerBidding,
  getRegisteredAuctions,
  makeBidInAuction,
  makeBid
};
