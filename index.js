const serviceAccount = require("./serviceAccountKey.json");
const axios = require("axios");
const convert = require("xml-js");
const admin = require("firebase-admin");
const cheerio = require("cheerio");
// import './serviceAccountKey.json'
// import axios from "axios";
// import convert from "xml-js";
// import * as admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// var response = await axios.get("https://kathmandupost.com/rss");
// var json = convert.xml2js(response.data, { compact: true, spaces: 4 });
// console.log(json.rss.channel.item.length); 40

// var response = await axios.get("https://nagariknews.nagariknetwork.com/feed");
// var json = convert.xml2js(response.data, { compact: true, spaces: 4 });
// console.log(json.rss.channel.item.length); 20

// https://thehimalayantimes.com/rss big pain in the ass

const getNews = async () => {
  var response = await axios.get("https://nagariknews.nagariknetwork.com/feed");
  var json = convert.xml2js(response.data, { compact: true, spaces: 4 });

  json.rss.channel.item.forEach(async (item) => {
    var { title, link, pubDate, guid, description } = item;

    // Using cheerio to extract <a> tags
    const $ = cheerio.load(item["content:encoded"]._cdata);
    const imgObjects = $("img");
    // this is a mass object, not an array

    // Collect the "href" and "title" of each link and add them to an array
    const images = [];
    imgObjects.each((index, element) => {
      images.push({
        src: $(element).attr("src"), // get the src attribute
      });
    });

    var post = {
      guid: guid._text,
      title: title._text,
      description: description._text,
      image: images.length > 0 ? images[0].src : "dummy.jpg",
      pubDate: pubDate._text,
      // genre
    };

    try {
      await docRef.add(post);
      console.log(post);
    } catch (e) {
      console.log(e);
    }
  });
};

const db = admin.firestore();

const docRef = db.collection("nagarik");

getNews();
