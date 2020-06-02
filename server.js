const express = require("express");
const mongoose = require("mongoose");
const shortUrl = require("./models/urlshortner");
const app = express();
app.use(express.urlencoded({ extended: false }));
mongoose.connect("mongodb://localhost/urlShortner", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  const shortUrls = await shortUrl.find();
  res.render("index", { shortUrls: shortUrls });
});
app.post("/short", async (req, res) => {
  await shortUrl.create({ full: req.body.fullUrl });
  res.redirect("/");
});
app.get("/:shortUrl", async (req, res) => {
  const short = await shortUrl.findOne({ short: req.params.shortUrl });
  if (short == null) return res.sendStatus(404);
  short.clicks++;
  short.save();
  res.redirect(short.full);
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Running @ " + PORT));
