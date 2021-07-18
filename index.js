const express = require("express");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

const app = express();
const port = process.env.PORT || 3000;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Database references
const db = admin.firestore();
const newsCollection = db.collection("news");

app.get("/", (req, res) => {
  res.send("It is working!");
});

app.get("/news", async (req, res) => {
  const newsRef = db.collection("news");
  const snapshot = await newsRef.orderBy("pubDate", "desc").get();
  if (snapshot.empty) {
    res.send("data empty");
  }

  const newsData = {};

  snapshot.forEach((doc) => {
    let docId = doc.id.toString();
    newsData[docId] = doc.data();
  });

  res.send(JSON.stringify(newsData));
});

app.listen(port, () => {
  console.log(`server is up on port: ${port}`);
});
