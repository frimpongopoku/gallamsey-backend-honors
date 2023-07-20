// Replace this word bank with your desired words
const wordBank = [
  "Lorem",
  "ipsum",
  "dolor",
  "sit",
  "amet",
  "consectetur",
  "adipiscing",
  "elit",
  "sed",
  "do",
  "eiusmod",
  "tempor",
  "incididunt",
  "ut",
  "labore",
  "et",
  "dolore",
  "magna",
  "aliqua",
];

function getRandomWord() {
  const randomIndex = Math.floor(Math.random() * wordBank.length);
  return wordBank[randomIndex];
}

function generateSentence(sentenceLength) {
  let sentence =
    getRandomWord().charAt(0).toUpperCase() + getRandomWord().slice(1);
  for (let i = 1; i < sentenceLength; i++) {
    sentence += " " + getRandomWord();
  }
  return sentence + ".";
}

function generateParagraph(paragraphLength, sentenceLength = 6) {
  let paragraph = generateSentence(sentenceLength);
  for (let i = 1; i < paragraphLength; i++) {
    paragraph += " " + generateSentence(sentenceLength);
  }
  return paragraph;
}
function getRandomItemFromArray(array) {
  if (!Array.isArray(array) || array.length === 0) {
    throw new Error("Input must be a non-empty array.");
  }

  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

function selectLocation() {
  const locations = [
    { coords: [20.102496, 57.562373] }, // ALU
    { coords: [-20.16346, 57.50553] }, // PORT LOUIS
    { coords: [-20.097468, 57.558565] }, // SSRN
    { coords: [-20.099683, 57.576605] }, // MAHOGANY
    { coords: [-20.021833, 57.578069] }, // LA CROISETTE
    { coords: [-20.012216, 57.587478] }, // SUPER U
    { coords: [-20.025658, 57.554009] }, // MON CHOISY RESIDENCE
    { coords: [-20.316945, 57.529971] }, // CUREPIPE
    { coords: [-20.293065, 57.367934] }, // FLIC
  ];
  return getRandomItemFromArray(locations);
}

module.exports = {
  generateParagraph,
  generateSentence,
  selectLocation,
};
