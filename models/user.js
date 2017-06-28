const mongoose = require ('mongoose');
const bcrypt = require ('bcrypt');
const config  = require ('../config/database');


const UserSchema = mongoose.Schema ({
                name:    {    
                            type: String 
                         }, 
                email:   {  type: String, 
                            required: true 
                         },
                username: {
                            type: String,
                            required: true
                          },
                password: {
                            type: String,
                            required: true
                          }
                                   });


 mongoose.Promise = global.Promise;

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(id, callback ) {
     User.findById (id, callback);
} 

module.exports.getUserByUsername = function(username, callback ) {
     const query  = {username: username}
     User.findOne(query, callback);
} 

module.exports.addUser = function(newUser, callback) { 
        bcrypt.genSalt ( 10, (err, salt ) => {
           bcrypt.hash (newUser.password, salt, ( err, hash) => {

                   if(err) throw err ; 
                        newUser.password = hash ; 
                        newUser.save(callback);
                        console.log ( 'hash: ', hash );
                        console.log ( 'salt: ', salt);
                        console.log ( 'callback: ',  callback); 
           });
        });
     }


module.exports.comparePassword = function ( candidatePassword, hash, callback) {
    bcrypt.compare( candidatePassword, hash, ( err, isMatch) => {
        if (err) throw err; 
        callback( null, isMatch);
    });
} 