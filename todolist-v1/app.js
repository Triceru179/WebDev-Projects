const express = require ("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();
let items = [];
let workItems = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/", function(req, res){
    let today = date.getDate();
    let today3 = date.getTry();
    res.render("list", {listTitle: today, kindOfToDo:items});
    // {foo: FOO} = proprerty do ejs: var local desse código
});

app.get("/work", function(req, res){
    res.render("list", {listTitle: "Work List", kindOfToDo:workItems});
})

app.post("/", function(req, res){

    let toDo = req.body.todo;

    if(req.body.addlist === "Work"){
        workItems.push(toDo);
        res.redirect("/work");
    } else {
        items.push(toDo); 
        res.redirect("/");
    }
})

app.listen(3000, function(){
    console.log("Server started on port 3000");
})