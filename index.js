var express = require("express");
var mongoose = require("mongoose");
const { check, validationResult } = require('express-validator');

var app = express();

//EJS
app.engine('html', require('ejs').renderFile);
app.set("view engine", "ejs");

//DB connection
var uri = "mongodb://localhost:27017/authentication";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on("connected", () => {
    console.log("DB conneted")
});
mongoose.connection.on("error", (err) => {
    console.log(err)
})

//schema & model

var schemas = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

var scheme = mongoose.model("registers", schemas);

//Body parser
app.use(express.urlencoded({ extended: true }));



//routes
app.get("/register" , (req,res) => {
    res.render("register");
})

app.post(
  "/register",
  [
    check('name').notEmpty().withMessage("name required"),
    check("email").isEmail().withMessage("email invalid"),
    // password must be at least 5 chars long
    check("password")
      .isLength({ min: 5 })
      .withMessage("must be at least 5 chars long"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      return res.render('register', { errors: errors.array() });
    }else{
        var success = `Register scuccess`;
       return res.render("register", { success }); 
    }

    var model = new scheme();
    model.name = req.body.name;
    model.email = req.body.email;
    model.password = req.body.password;

    model.save(function (err, doc) {
      if (err) throw err;
    //   res.redirect("login");
    });
  }
);






// app.post("/register", (req, res) => {

//     var errors = [];

//     if (req.body.name == "" && req.body.email == "" && req.body.password == "") {
//         errors.push("Fill all the fileds")
//     }
//     if (req.body.name == ""){
//         errors.push("Name is required");
//     }
//     if (req.body.email == ""){
//         errors.push("Email is required");
//     }
//     if (req.body.password.length < 6){
//         errors.push("password length should be greater than 6 chars")
//     }
//     console.log(errors);

//     if(errors.length > 0){
//         res.render('register' , {err : errors});
//     }else{
//         scheme.findOne({ email: req.body.email }).then(user => {
//             if (user) {
//                 errors.push('Email already exists');
//                 res.render('register', { err: errors });
//             } else{
//                 var model = new scheme();
//                 model.name = req.body.name;
//                 model.email = req.body.email;
//                 model.password = req.body.password;

//                 model.save(function (err, doc) {
//                     if (err) throw err;
//                     res.redirect('login');
//                 });
//             }
//     })
    
// }

// });

var loginErr = [];
//Login
app.get("/login", (req, res) => {
    res.render("login");
})

//login post
app.post("/login",function(req,res){
    scheme.find({ 'name': req.body.name, 'password': req.body.password }, function (err, user) {

        if (err) {

            console.log(err);
            return done(err);
        }

        //if user found.
        if (user.length != 0) {
           
            res.render("welcome", { name: req.body.name });
          

        }else{
            loginErr.push('Signup error');
            res.render("login", { err: loginErr});
        }
   })
});

app.listen(3000 , function(){
    console.log('Listening to port 3000');
})