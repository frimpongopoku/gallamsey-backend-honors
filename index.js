const express = require("express");
const { connectToDatabase } = require("./db/utils");
const { URI } = require("./db/values");

const app = express();

app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

connectToDatabase(URI);
const port = 3000;
app.listen(port, () => {
  console.log(
    `Server running on port ${port}.\nVisit http://localhost:${port}`
  );
});
