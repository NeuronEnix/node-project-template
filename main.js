// npm modules
const express = require("express");

// handler
const {
    dbHandler, reqHandler, resHandler
} = require( "./handler" );

// Initializing stuffs
dbHandler.connectToDatabase(); 

// Express setup
const app = express();
app.use( express.json() );
app.use( reqHandler.reqLogger );
app.use( require( "./api" ) );

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