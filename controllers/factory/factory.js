const nameBank = [
  "Felicia",
  "Cynthia",
  "Sinatra",
  "Stallion",
  "Pongo",
  "Sewhi",
  "Mavis",
  "Michael",
  "Ted",
  "Rita",
  "Irene",
  "Sandra",
  "Twum",
  "Juliana",
  "Jeff",
  "Kele",
  "Boras",
  "Nickolas",
  "Sypher",
];
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

function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }

  return randomString;
}
function getRandomWord() {
  const randomIndex = Math.floor(Math.random() * wordBank.length);
  return wordBank[randomIndex];
}

function getRandomFullName() {
  const randomIndex = Math.floor(Math.random() * nameBank.length);
  const second = Math.floor(Math.random() * nameBank.length);
  return nameBank[randomIndex] + " " + nameBank[second];
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
  // Notes to self: 
  // When google gives coordinates (thats where you copied these coords from), the format is [lat, long] but mongoDB expects coords to be [long,lat]
  // Note to self: so if you record coords directly from google map, remember to reverse
  const locations = [
    { coords: [-20.102496, 57.562373].reverse(), name: "ALU" }, // ALU
    { coords: [-20.16346, 57.50553].reverse(), name : "Port Louis" }, // PORT LOUIS
    { coords: [-20.097468, 57.558565].reverse(), name : "SSRN" }, // SSRN
    { coords: [-20.099683, 57.576605].reverse(), name : "Mahogany" }, // MAHOGANY
    { coords: [-20.021833, 57.578069].reverse(), name : "La Croisette" }, // LA CROISETTE
    { coords: [-20.012216, 57.587478].reverse(), name : "Super U" }, // SUPER U
    // { coords: [-20.025658, 57.554009], name : "Mon Choisy Residence" }, // MON CHOISY RESIDENCE
    { coords: [-20.316945, 57.529971].reverse(), name : "Curepipe" }, // CUREPIPE
    { coords: [-20.293065, 57.367934].reverse(), name : "Flic" }, // FLIC
  ];
  return getRandomItemFromArray(locations);
}

module.exports = {
  generateParagraph,
  generateSentence,
  selectLocation,
  getRandomFullName, 
  generateRandomString
};
