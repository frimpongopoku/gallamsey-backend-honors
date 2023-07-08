const { default: mongoose } = require("mongoose");

async function connectToDatabase(uri) {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("[+] Connected to the database successfully...!");
  } catch (err) {
    console.error("Error connecting to the database", err);
  }
}

module.exports = {
  connectToDatabase,
};
