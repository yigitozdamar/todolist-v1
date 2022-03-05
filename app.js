const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

let items = [];
let works = [];

app.get("/", function (req, res) {
  let day = date.GetDate();

  res.render("list", { listTitle: day, newItemsArray: items });
});

app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work", newItemsArray: works });
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.post("/", function (req, res) {
  let item = req.body.newItemText;

  if (req.body.button === "Work") {
    works.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.listen(3000, function () {
  console.log("Server has started on port 3000...");
});
