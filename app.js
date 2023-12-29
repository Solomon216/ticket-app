const express=require('express')
const bodyParser = require("body-parser");
const ejs=require('ejs')
const _=require('lodash')
const router = express.Router();
const passport=require('passport')
const findOrCreate = require("mongoose-findorcreate");
const mongoose=require("mongoose")
const mongo=require("mongod")
var Schema=mongoose.Schema

mongoose.connect("mongodb+srv://fnsanjay:hihello8@cluster0.jk9aysh.mongodb.net/ticketdb"); 

var eventSchema = new Schema({
    id: Number,
    artist: String,
    name : String,
    date: String,
    price: String,
    location: String,
    image : String,
    showmedia: String
})

eventSchema.plugin(findOrCreate)
const Events = mongoose.model("Events",eventSchema)

const app= express();
app.set("view engine",'ejs')

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.get("/",function(req,res){
    async function getShows(){
        const posts = await Events.find({});
        res.render("home", {
          shows: posts
        });
      }
      getShows();
})
app.get('/details/:id', (req, res) => {
    const showId = req.params.id;
    async function showData(){
        let data = await Events.findOne({"id":showId});
        res.render('details', { show : data });
    }
    showData()
});

app.get('/stage/:id', (req,res) => {
    const id=req.params.id;
    res.render('stage',{show: id})
})

app.get('/purchase/:id', (req,res) => {
    res.render('purchase')
})


app.listen(3000, function() {
    console.log("Server started on port 3000");
  });


  var GoogleStrategy = require('passport-google-oauth20').Strategy;

  passport.use(new GoogleStrategy({
      clientID:"31397093146-k9gq6vmrg01km2qt1k0v7rd9m0jt38ns.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:3000/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, cb) {
      Events.findOrCreate({ googleId: profile.id }, function (err, user) {
        return cb(err, user);
      });
    }
  ));

  app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/auth/google' }),
  function(req, res) {
    res.redirect('/');
  });
