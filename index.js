const main = require("./components/News");

const path = require("path");
const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

server.listen(port, () => {
  console.log("server is up on port 3000");
});
