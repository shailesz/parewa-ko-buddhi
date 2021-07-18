// const main = require("./components/News");

const express = require("express");

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.get("/hey", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log("server is up on port 3000");
});
