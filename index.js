const express = require("express");
const { connectToDatabase } = require("./db/utils");
const bodyParser = require("body-parser");
const { URI } = require("./db/values");
const { usersRouter, errandRouter, newsRouter } = require("./routers/routes");
const app = express();

// Parse application/x-www-form-urlencoded
app.use(bodyParser.json({ extended: false }));
// Parse application/json
app.use(bodyParser.json());
// Log request URL 
app.use((req, res, next) => {
  console.log(req.url);
  next();
});

app.get("/", (req, res) => {
  res.send("This place na main page ooo!");
});

app.use("/users", usersRouter);
app.use("/errands", errandRouter);
app.use("/news", newsRouter);

connectToDatabase(URI);
const port = 4000;
app.listen(port, () => {
  console.log(
    `Server running on port ${port}.\nVisit http://localhost:${port}`
  );
});
