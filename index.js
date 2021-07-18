const express = require("express");

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("It is working!");
});

app.get("/news", () => {
  res.send("we have the news");
});

app.listen(port, () => {
  console.log(`server is up on port: ${port}`);
});
