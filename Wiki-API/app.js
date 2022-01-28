//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/wikiDB');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//TODO
const articlesSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model("Article", articlesSchema);

app.route("/articles")
    .get(function(req, res){
        Article.find(function(err, allArticles){
        if(!err){
            res.send(allArticles);
        } else {
            res.send(err);
        }
        });
    })
    .post(function(req, res){
        console.log(req.body.title);
        console.log(req.body.content);

        const article = new Article({
            title: req.body.title,
            content: req.body.content
        });

        article.save(function(err){
            if(!err){
                res.send("Successfully article added");
            } else {
                res.send(err);
            }
        });
    })
    .delete(function(req, res){
        Article.deleteMany(function(err){
            if(!err){
                res.send("Articles has been deleted.");
            } else {
                res.send(err);
            }
        }); 
    });

////////////////////////////////////////// ROUTE TO ONE ARTICLE

app.route("/articles/:articleTitle")
    .get(function(req, res){
        
        Article.findOne({title: req.params.articleTitle}, function(err, oneArticle){
            if(!err){
                if(!oneArticle){
                    res.send("There's no article here");
                } else {
                    res.send(oneArticle);
                }
            } else {
                res.send(err);
            }
        });
    })
    .put(function(req, res){
        Article.updateOne(
            {title: req.params.articleTitle}, 
            {title: req.body.title, content: req.body.content},
            function(err){
                if(!err){
                    res.send("successfully changed the article (patch)");
                } else{
                    res.send(err);
                }
            });
    })
    .patch(function(req, res){
        Article.updateOne(
            {title: req.params.articleTitle}, 
            {$set: req.body},
            function(err){
                if(!err){
                    res.send("successfully changed the article (patch)");
                } else{
                    res.send(err);
                }
            });
    })
    .delete(function(req, res){
        Article.deleteOne(
            {title: req.params.articleTitle},
            function(err){
                if(!err){
                    res.send("successfully removed");
                } else {
                    res.send(err);
                }
            });
    });




app.listen(2600, function() {
  console.log("Server started on port 2600");
});