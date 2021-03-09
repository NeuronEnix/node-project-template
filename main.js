const express = require("express");
const app = express();

const requestHandler = require( "./middleware/requestHandler" );
const { resOk, resErr, resErrType, uncaughtErrHandler } = require( "./middleware/responseHandler" );

app.use( express.json() );
app.use( requestHandler.logger );


app.post( "/", ( req, res, next ) => {
    resOk( res, "hello");
});

app.use( ( req, res ) => resErr( res, resErrType.invalidAPI ) );
app.use( uncaughtErrHandler );

const PORT = process.env.PORT || 8080
app.listen( PORT, () => console.log("Server listening at:", PORT ) );