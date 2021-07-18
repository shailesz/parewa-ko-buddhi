const serviceAccount = require("../serviceAccountKey.json");
const axios = require("axios");
const convert = require("xml-js");
const admin = require("firebase-admin");
const shajs = require("sha.js");

const { HimalayanTimes, NagarikNews, KathmanduPost } = require("../models");
const constants = require("../constants");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Database references
const db = admin.firestore();
const newsCollection = db.collection("news");

/**
 * Returns array of posts from a raw array of posts
 * @param {Array} rawPostsArray array returned from rss feed
 * @param {string} source required to use various methods
 * @returns filtered array of posts
 */
const generatePosts = (rawPostsArray, source) => {
  const filteredPostsArray = rawPostsArray.map((item) => {
    switch (source) {
      case constants.HIMALAYAN_TIMES:
        return HimalayanTimes.generatePost(item, source);
      case constants.KATHMANDU_POST:
        return KathmanduPost.generatePost(item, source);
      case constants.NAGARIK_NEWS:
        return NagarikNews.generatePost(item, source);
    }
  });
  return filteredPostsArray;
};

/**
 * Fetch posts and try upload to database
 * @param {string} url uses this url to fetch and process rss
 * @param {string} source uses this to use respective classes
 */
const fetchNews = async (url, source) => {
  try {
    const { data } = await axios.get(url);
    const { rss } = convert.xml2js(data, { compact: true, spaces: 4 });

    const postsData = generatePosts(rss.channel.item, source);

    postsData.forEach((post) => {
      newsCollection
        .doc(shajs("sha256").update(post.link.toString()).digest("hex"))
        .set(post);
    });
  } catch (error) {
    console.log("error:", error);
  }
};

/**
 *  main program logic
 */
module.exports = main = () => {
  fetchNews(
    "https://thehimalayantimes.com/rssFeed/0",
    constants.HIMALAYAN_TIMES
  );

  fetchNews("https://kathmandupost.com/rss", constants.KATHMANDU_POST);

  fetchNews(
    "https://nagariknews.nagariknetwork.com/feed",
    constants.NAGARIK_NEWS
  );
};
