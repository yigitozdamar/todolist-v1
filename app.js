const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash")

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

mongoose.connect("mongodb+srv://yigitozdamar:yigitozdamar123@cluster0.66djs.mongodb.net/todolistDB", {
  useNewUrlParser: true,
});

const itemsSchema = {
  name: String,
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome to your todolist!",
});

const item2 = new Item({
  name: "Hit the + button to add a new item",
});
const item3 = new Item({
  name: "<--Hit this to delete an item",
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema],
};

const List = mongoose.model("List", listSchema);

app.get("/", function (req, res) {
  Item.find({}, function (err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function (err, items) {
        if (err) {
          console.log(err);
        } else {
          console.log("Database added successfully!");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", { listTitle: "Today", newItemsArray: foundItems });
    }
  });
});

app.get("/:customListName", function (req, res) {
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({ name: customListName }, function (err, foundList) {
    if (!err) {
      if (!foundList) {
        const list = new List({
          name: customListName,
          item: defaultItems,
        });

        list.save();
        res.redirect("/" + customListName);
      } else {
        res.render("list", {
          listTitle: foundList.name,
          newItemsArray: foundList.items,
        });
      }
    }
  });
});

app.post("/", function (req, res) {
  let itemName = req.body.newItemText;
  let listName = req.body.list;

  const item = new Item({
    name: itemName,
  });

  if (listName === "Today") {
    item.save();
    res.redirect("/");
  }else{
    List.findOne({name: listName}, function (err, foundList) {
      console.log(foundList);
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    })
  }
});

app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemId, function (err) {
      if (!err) {
        console.log("Deleted successfully");
        res.redirect("/");
      }
    });  
  }else{
    List.findOneAndUpdate({name:listName}, {$pull :{items:{_id: checkedItemId}}}, function(err,foundList){
      if (!err) {
        res.redirect("/" + listName);
      }
    })
  }

  
});

let port = process.env.PORT
if (port == null || port =="") {
  port = 3000;
}

app.listen(3000, function () {
  console.log("Server has started on port 3000...");
});
