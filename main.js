const express = require("express");
const app = express();

const reqLogger = require( "./middleware/requestLogger" );
const { resOk, resErr, resErrObj, uncaughtErrHandler } = require( "./middleware/response" );

app.use( express.json() );
app.use( reqLogger );


app.post( "/", ( req, res, next ) => {
    resOk( res, "hello");
});

app.use( ( req, res ) => resErr( res, resErrObj.invalidAPI ) );
app.use( uncaughtErrHandler );

const PORT = process.env.PORT || 8080
app.listen( PORT, () => console.log("Server listening at:", PORT ) );