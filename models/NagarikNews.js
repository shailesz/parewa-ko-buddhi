const cheerio = require("cheerio");

module.exports = class NagarikNews {
  static generatePost = (rawPost, source) => {
    const { title, link, pubDate, description } = rawPost;

    // Using cheerio to extract <img> tags
    const $ = cheerio.load(rawPost["content:encoded"]._cdata);
    const imgObjects = $("img"); // this is a mass object, not an array

    // Collect the "href" and "title" of each link and add them to an array
    const images = [];
    imgObjects.each((index, element) => {
      images.push({
        src: $(element).attr("src"), // get the src attribute
      });
    });

    const post = {
      link: link._text,
      title: title._text,
      description: description._text,
      imageURL: images.length > 0 ? images[0].src : "dummy.jpg",
      pubDate: Date.parse(`${pubDate._text}`),
      source: source,
      section: link._text.split("/")[3],
    };

    return post;
  };
};
