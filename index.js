const express = require("express");

const main = require("./components/News");

// post grabber
main();

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("It is working!");
});

app.listen(port, () => {
  console.log(`server is up on port: ${port}`);
});
