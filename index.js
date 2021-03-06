const express = require("express");
const admin = require("firebase-admin");
const serviceAccountKey = {
  projectId: process.env.PROJECT_ID,
  clientEmail: process.env.CLIENT_EMAIL,
  privateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

const app = express();
const port = process.env.PORT || 3000;

var allowCrossDomain = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Length, X-Requested-With"
  );

  // intercept OPTIONS method
  if ("OPTIONS" == req.method) {
    res.send(200);
  } else {
    next();
  }
};

app.use(allowCrossDomain);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
});

// Database references
const db = admin.firestore();

app.get("/", (req, res) => {
  res.send("It is working!");
});

app.get("/news", async (req, res) => {
  const newsRef = db.collection("articles");
  const snapshot = await newsRef.orderBy("timestamp", "desc").limit(41).get();
  if (snapshot.empty) {
    res.send("data empty");
  }

  const newsData = [];

  snapshot.forEach((doc) => {
    let docId = doc.id.toString();
    let docData = { ...doc.data(), id: docId };
    newsData.push(docData);
  });

  res.send(JSON.stringify(newsData));
});

app.listen(port, () => {
  console.log(`server is up on port: ${port}`);
});
