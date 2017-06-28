const http    = require ('http');
const express = require('express');
const path    = require ('path');
const config  =  require ('./config/database');
const mongoose = require ('mongoose');
const cors     = require ('cors');
const passport = require ('passport'); 
const bodyParser = require ('body-parser');



// connect database 
mongoose.connect(config.database);
// check connection 
mongoose.connection.on('connected', () => {
    console.log( 'connected to database'+ config.database ) ; 
});

//check error connection 
mongoose.connection.on( 'error', () => {
    console.log( 'error to connect to database'+ config.database );
});




const app  = express(); 
const users = require ('./routes/users');
const port = 3000 ; 

app.use(cors());

// set the static page ( when application is loaded file in floder it load first )
app.use ( express.static(path.join(__dirname, 'public')));


app.use(bodyParser.json());
//passport middleware 
app.use(passport.initialize());
app.use(passport.session());


require( './config/passport') (passport); 
app.use('/users', users ) ;







app.get('/', (req, res) => {
    res.send('Invalid endpoint');
}); 


app.listen( port, function ( req, res ) {
      console.log ('Server is runnoing on port: ' + port ) ; 
});