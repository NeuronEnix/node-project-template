// npm modules
const express = require("express");

// handler
const {
    dbHandler, reqHandler, resHandler
} = require( "./handler" );

dbHandler.connectToDatabase(); 

// Express setup
const app = express();
app.use( express.json() );
app.use( reqHandler.reqLogger );


app.post( "/", ( req, res, next ) => {
    resHandler.resOk( res, "hello");
});

// Invalid / Unknown API
app.use( "*", ( req, res ) => resHandler.resErr( res, resHandler.resErrType.invalidAPI ) );
app.use( resHandler.uncaughtErrHandler );

const PORT = process.env.PORT || 8080
app.listen( PORT, () => console.log("Server listening at:", PORT ) );