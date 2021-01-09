const express = require('express');
const app = express();
const { connectDB } = require('./config/db');
const bodyParser = require('body-parser')

connectDB();

app.use(bodyParser.json({ limit: '10mb' }));

app.get("/", (req, res) => res.status(200));

app.use("/register", require("./routes/register"));
app.use("/list", require("./routes/list"));
app.use("/bid", require("./routes/bid"));
app.use("/manage", require("./routes/manage"));

const PORT = 3000;
app.listen(PORT, () => console.log(`Server started on PORT: ${PORT}`));
