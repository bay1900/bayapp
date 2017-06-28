const express  = require('express');
const router   = express.Router() ;
const passport = require ('passport');
const jwt      = require ('jsonwebtoken');
const config   = require ('../config/database');
const User     = require ( '../models/user');




router.post('/register', (req, res, next) =>  {
                
                let newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    username: req.body.username,
                    password: req.body.password
                });

 // call the hash function when user input infomatiom 
 // hash passwod only
     User.addUser (newUser, (err, user) => {
            if(err) { 
                res.json({ success: false, msg: 'failed to register user'});
                    } else  
                          { res.json({ success: true, msg: 'User registered'});
                  }
              }); 
         });


router.post ('/authenticate', function ( req, res, next ) {

    // when user submit register form we will get the value of usernmae and password 
    // const usernmae and const password this is in our lacal database
            const username = req.body.username;
            const password = req.body.password;

    
    // check new username with our username in local database
    User.getUserByUsername(username, (err, user) => {
        if (err)  throw err ;
         if(!user) {
             return res.json({ success: false, msg: ' User not found'});
         }
   
   // check new password with our password in local database
   //if match create token by using the secret key in the database secret code 
    User.comparePassword ( password, user.password, (err, isMatch) => {
             if(err) throw err;
             if(isMatch) {
                 const token = jwt.sign(user, config.secret, {
                     expiresIn: 6048000 // a week
                 });

                 res.json({ 
                     success: true,
                     token: 'JWT '+token,
                     user: {
                         id: user._id,
                         name: user.name,
                         username: user.username,
                         email: user.email
                     }
                 });

             } else {
                 return res.json({ success: " Wrong password"});
             }
      });
    });
});


router.get ('/profile', passport.authenticate('jwt', {session: false }), function ( req, res, next ) {
    res.send ('this is profile age');
});



module.exports = router ;
