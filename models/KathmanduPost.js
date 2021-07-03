module.exports = class KathmanduPost {
  static generatePost = (rawPost, source) => {
    const { title, link, description } = rawPost;

    const post = {
      link: link._text,
      title: title._text,
      description: description._text,
      imageURL: "dummy.jpg",
      pubDate: Date.now(),
      source: source,
      section: link._text.split("/")[3],
    };

    return post;
  };
};
