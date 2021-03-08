const express = require("express");
const app = express();
app.get( "/", ( req, res, next ) => {
    res.status( 200 ).send( "Hello...");
});
app.listen( 9999, () => console.log("Server listening at: 9999" ) );