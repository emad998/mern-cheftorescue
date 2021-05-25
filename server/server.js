const express = require('express')
var cors = require('cors')
const mongoose = require('mongoose')
// const passport = require('passport')
const findOrCreate = require('mongoose-findorcreate')
// require('dotenv').config()
// const cookieSession = require("cookie-session");
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session')
const cookieParser = require('cookie-parser')
const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client('418479286522-kdaphilh80lfvodbnn8dnehv1htea6rp.apps.googleusercontent.com')
require('dotenv').config()



mongoose.connect(`${process.env.MONGO_URI}`, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})

const userSchema = new mongoose.Schema({
    databaseEmail: String,
    userName: String,
    favorites: Array
})

userSchema.plugin(findOrCreate)

const User = new mongoose.model("User", userSchema);

const app = express()

// app.use(cookieSession({
//   // milliseconds of a day
//   maxAge: 24*60*60*1000,
//   keys:[process.env.COOKIE_SECRET]
// }));

app.use(cors())

app.use(express.json())
app.use(session({ secret: 'keyboard cat', resave: true, cookie: { maxAge: 60000 }}))
app.use(cookieParser())



// app.use(passport.initialize());
// app.use(passport.session());


// passport.use(new GoogleStrategy({
//     clientID: process.env.CLIENT_ID,
//     clientSecret: process.env.CLIENT_SECRET,
//     callbackURL: "/auth/google/redirect"
//   },
//   function(accessToken, refreshToken, profile, cb) {
//     User.findOrCreate({ googleId: profile.id, userName: profile.displayName }, function (err, user) {
//       return cb(err, user);
//     });
//   }
// ));

// passport.serializeUser(function(user, done) {
//   done(null, user.id);
// });

// passport.deserializeUser(function(id, done) {
//   User.findById(id, function(err, user) {
//     done(err, user);
//   });
// });


app.get('/', function(req, res) {
    res.send("Welcome")
})

// app.get("/auth/google", passport.authenticate("google", {
//   scope: ["profile", "email"],
//   prompt: "select_account"
// }));


// app.get("/auth/google/redirect",passport.authenticate('google'), function(req, res) {
//   res.send(req.user.userName)
// });

app.post("/api/v1/auth/google", async (req, res) => {
    const { token }  = req.body
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: '418479286522-kdaphilh80lfvodbnn8dnehv1htea6rp.apps.googleusercontent.com'
    });
    const { name, email } = ticket.getPayload();    
    // const user = {nameTest: name, emailTest: email, pictureTest: picture}
    User.findOrCreate({databaseEmail: email, userName: name})
.then((result) => {
    res.status(201)
    res.json(result.doc);
    console.log(result.isNew);
})
.catch(console.error);
    
    
})



app.post("/getuser", async (req, res) => {
    const { token }  = req.body
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: '418479286522-kdaphilh80lfvodbnn8dnehv1htea6rp.apps.googleusercontent.com'
    });
    const { name, email } = ticket.getPayload();    
    // const user = {nameTest: name, emailTest: email, pictureTest: picture}
    User.findOrCreate({databaseEmail: email, userName: name})
.then((result) => {
    res.status(201)
    req.session.userId = result.doc._id
    res.json(result.doc);
    console.log(result.isNew);
})
.catch(console.error);
    
    
})





app.post("/addlike", async (req, res) => {
    const { token, databaseId, nameOfMeal, idMeal }  = req.body
    console.log(databaseId)
    console.log(idMeal)
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: '418479286522-kdaphilh80lfvodbnn8dnehv1htea6rp.apps.googleusercontent.com'
    });
    const { name, email } = ticket.getPayload();    
    
    User.findById(databaseId)
    .then(user => {
        console.log(user)
        let userFavorites = user.favorites
        userFavorites.push({mealName: nameOfMeal, mealId: idMeal})
        user.databaseEmail = email,
        user.userName = name,
        user.favorites = userFavorites

        user.save()
        .then(() => res.json(user))
        
    })
    
    
})

app.post("/getlikes", async (req, res) => {
    const { token,  databaseId}  = req.body
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: '418479286522-kdaphilh80lfvodbnn8dnehv1htea6rp.apps.googleusercontent.com'
    });
    const { name, email } = ticket.getPayload();    
    // const user = {nameTest: name, emailTest: email, pictureTest: picture}
    User.findById(databaseId)
    .then(user => {
        res.json(user.favorites)
    })

    
    
})



app.post("/deletemeal", async (req, res) => {
    const { token,  databaseId, nameOfMeal, idOfMeal}  = req.body
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: '418479286522-kdaphilh80lfvodbnn8dnehv1htea6rp.apps.googleusercontent.com'
    });
    const { name, email } = ticket.getPayload();    
    // const user = {nameTest: name, emailTest: email, pictureTest: picture}
    User.findById(databaseId)
    .then(user => {
        let userFavorites = user.favorites
        let filtered = userFavorites.filter(meal => meal.mealId != idOfMeal)
        user.favorites = filtered
        user.save()
        res.json(user)
    })
    
    
})



app.listen(5000, console.log('server running on port 5000'))