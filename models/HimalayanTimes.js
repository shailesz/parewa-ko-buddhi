const { generateSection } = require("../utils");

module.exports = class HimalayanTimes {
  static generatePost = (rawPost, source) => {
    const { title, link, description, pubDate } = rawPost;
    const imageURL =
      rawPost["media:thumbnail"]._attributes.url === "" || undefined || null
        ? "dummy.jpg"
        : rawPost["media:thumbnail"]._attributes.url;

    const post = {
      link: link._cdata,
      title: title._cdata,
      description: description._cdata,
      imageURL: imageURL,
      pubDate: pubDate._text,
      source: source,
      section: generateSection(link._cdata.split("/")[3]),
    };

    return post;
  };
};
