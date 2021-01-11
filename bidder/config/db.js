const config = require('nconf');
const http = require("http")

const registerItself = async () => {
  const rand = Math.random(10) * 10;
  var body = JSON.stringify({
    name: "bidder" + rand.toFixed()
  });
  config.file({ file: './default.json' });
  http.request(
    {
      hostname: "127.0.0.1",
      path: "/register/createBidder",
      port: 3000,
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
        hostname: "127.0.0.1",
        path: "/register/registerBidder",
        port: 3000,
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
const getRegisteredAuctions = async () => {
  return httprequest();
  function httprequest() {
    return new Promise((resolve, reject) => {
      const bidder_id = config.get('bidderId')
      http.request({
        hostname: "127.0.0.1",
        path: "/list/registeredAuctions?bidder_id="+bidder_id,
        port: 3000,
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
module.exports = {
  registerItself,
  registerBidding,
  getRegisteredAuctions
};
