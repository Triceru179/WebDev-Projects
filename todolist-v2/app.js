const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


mongoose.connect('mongodb://localhost:27017/todolistDB');

//mongoose.connect("mongodb+srv://admin->name<:>password<@cluster0.axrik.mongodb.net/todolistDB", {useNewUrlParser: true});

const itemsSchema = {
  name: String,
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "item a",
});

const item2 = new Item({
  name: "item bb",
});

const item3 = new Item({
  name: "item ccc",
});

const defaultItem = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/", function(req, res) {

  Item.find({}, function(err, foundItems){

    if (foundItems.length === -1) {
      Item.insertMany(defaultItem, function(err){
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully savevd default items to DB.");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {listTitle: "Today", newListItems: foundItems});
    }
  });

});

app.get("/:listName", function(req, res){
    const customListName = _.lowerCase(req.params.listName);

    List.findOne({name: customListName}, function(err, foundList){
      if (!err){
        if (!foundList){
          const list = new List({
            name: customListName,
            items: defaultItem
          });
          list.save();
          res.redirect("/" + customListName);
        } else {
          res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
        }
      }
    });
    
});


app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const currentList = req.body.list;

  const item = new Item({
    name: itemName
  });

  if(currentList === "Today"){
    item.save();
    res.redirect("/");
  } else {
    List.findOne({name: currentList}, function(err, foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + currentList);
    });
  }

});

app.post("/delete", function(req, res){
  
  const checkedItemId = req.body.checkbox;
  const currentList = req.body.list;

  if(currentList === "Today"){

    Item.findByIdAndRemove(checkedItemId, function(err){
      if(!err){
        console.log("the item was removed");
        res.redirect("/");
      }
    });

  } else{

    List.findOneAndUpdate({name: currentList}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
      if (!err){
        res.redirect("/" + currentList);
      }
    });

  }


});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});


app.listen(2700, function() {
  console.log("Server has started on port 2700");
});