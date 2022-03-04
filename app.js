const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

var items = [];
var works = [];
app.get("/", function (req, res) {
  var today = new Date();

  var options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };

  var day = today.toLocaleDateString("en-US", options);

  res.render("list", { listTitle: day, newItemsArray: items });
});

app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work", newItemsArray: works });
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.post("/", function (req, res) {
  var item = req.body.newItemText;

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
