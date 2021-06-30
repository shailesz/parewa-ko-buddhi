const serviceAccount = require("./serviceAccountKey.json");
const axios = require("axios");
const convert = require("xml-js");
const admin = require("firebase-admin");
const cheerio = require("cheerio");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const getHimalayanTimes = async () => {
  const response = await axios.get("https://thehimalayantimes.com/rssFeed/0");
  const { rss } = convert.xml2js(response.data, { compact: true, spaces: 4 });

  rss.channel.item.forEach(async (item) => {
    const { title, link, description, pubDate } = item;

    const image =
      item["media:thumbnail"]._attributes.url === "" || undefined || null
        ? "dummy.jpg"
        : item["media:thumbnail"]._attributes.url;

    const post = {
      guid: link._cdata,
      title: title._cdata,
      description: description._cdata,
      image,
      pubDate: pubDate._text,
      source: "The Himalayan Times",
      section: link._cdata.split("/")[3],
    };

    const docRef = db.collection("himalayan times");

    try {
      await docRef.add(post);
    } catch (e) {
      console.log(e);
    }
  });
};

const getKathmanduPost = async () => {
  //   "   &quot;
  // '   &apos;
  // <   &lt;
  // >   &gt;
  // &   &amp;
  const docRef = db.collection("kathmandu post");

  const { data } = await axios.get("https://kathmandupost.com/rss");
  const { rss } = convert.xml2js(data.replace("&", "&amp;"), {
    compact: true,
    spaces: 4,
  });

  rss.channel.item.forEach(async (item) => {
    const { title, link, description } = item;

    const post = {
      guid: link._text,
      title: title._text,
      description: description._text,
      image: "dummy.jpg",
      pubDate: Date.now(),
      source: "Kathmandu Post",
      section: link._text.split("/")[3],
    };

    try {
      await docRef.add(post);
    } catch (e) {
      console.log(e);
    }
  });
};

// TODO translate functionality in server
const getNews = async () => {
  const response = await axios.get(
    "https://nagariknews.nagariknetwork.com/feed"
  );
  const json = convert.xml2js(response.data, { compact: true, spaces: 4 });

  json.rss.channel.item.forEach(async (item) => {
    const { title, link, pubDate, guid, description } = item;

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

    // TODO make source static string
    const post = {
      guid: guid._text,
      title: title._text,
      description: description._text,
      image: images.length > 0 ? images[0].src : "dummy.jpg",
      pubDate: pubDate._text,
      source: "Nagarik News",
      section: guid._text.split("/")[3],
    };

    const docRef = db.collection("nagarik");

    try {
      await docRef.add(post);
    } catch (e) {
      console.log(e);
    }
  });
};

// getNews();
// getKathmanduPost();
getHimalayanTimes();
