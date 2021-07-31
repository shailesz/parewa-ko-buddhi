/**
 * generate section from passed section string
 * @param {string} section string to be capitalized
 * @returns string with first letter capitalized
 */
const generateSection = (section) => {
  const words = section.split(" ");
  return words
    .map((word) => {
      return word[0].toUpperCase() + word.substring(1);
    })
    .join(" ");
};

module.exports = { generateSection };
