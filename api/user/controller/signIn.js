const User = require("../model");
const { resOk, resErr, resErrType } = require( "../../../handler").resHandler;
module.exports = async function signIn( req, res, next ) {    

    try {
        const { email, pass } = req.body;
        const userDoc = await User.findOne( {email, pass}, { _id:1, name:1} )

        // if email and pass didn't match
        if ( !userDoc ) return resErr( res, resErrType.invalidCred, { infoToClient: "Email or Password Incorrect" } );
        
        return resOk( res, userDoc );
    } catch ( err ) {
        return resErr( res, resErrType.unknownErr, { infoToServer:err } );
    }
}