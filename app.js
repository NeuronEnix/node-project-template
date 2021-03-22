require( "dotenv" ).config();
// npm modules
const express = require("express");
const passport = require( "passport" );
require( "./googleAuth" )( passport );
const path = require( "path" );

var cookieParser = require('cookie-parser')

// handler
const {
    dbHandler, reqHandler, resHandler, tokenHandler,
} = require( "./handler" );

// Initializing stuffs
dbHandler.connectToDatabase(); 

// Express setup
const app = express();
app.use( cookieParser() );
app.use( express.json() );
app.use('/', express.static('public') );
app.use( reqHandler.reqLogger );

app.use(passport.initialize());
app.get( "/google", passport.authenticate( "google", { scope: [ "profile", "email" ] } ) );
app.get( "/google/callback", passport.authenticate( "google", { failureRedirect: "/login" } ), ( req, res ) => {
    return resHandler.resOk( res, { user: req.user } );
} );

// // Token related stuffs
// app.use( tokenHandler.router ); // grants new refTok and accTok
// app.use( tokenHandler.authorizer );

// // Resource API
app.use( require( "./api" ) );

app.get( "/resource", tokenHandler.softAuthorize, tokenHandler.hardAuthorize, ( req, res, next ) => {
    return resHandler.resOk( res, {
        Resource: "Here is the Resource..."
    })
}) 

// Invalid / Unknown API
app.use( ( req, res ) => {
    try {
        resHandler.resErr( res, resHandler.resErrType.invalidAPI );
    } catch ( err ) {
        if ( err.code === "ERR_HTTP_HEADERS_SENT" )
            console.log( "Response was already sent for url:", req.url );
            console.log( {...res._log} );
    }
} );

// all uncaught error handler
app.use( resHandler.uncaughtErrHandler );

// Run the server
const PORT = process.env.PORT || 8080
app.listen( PORT, () => console.log( "Server listening at:", PORT ) );
