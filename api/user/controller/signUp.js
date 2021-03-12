const bcrypt = require( "bcrypt" );
const User = require("../model");
const { resOk, resErr, resErrType } = require( "../../../handler").resHandler;
module.exports = async function signUp( req, res, next ) {    

    try {
        req.body.pass = await bcrypt.hash( req.body.pass, 10 );
        const userDoc = new User();
        Object.assign( userDoc, req.body );
        await userDoc.save()
        return resOk( res );

    } catch ( err ) {
        if( err.code === 11000 ) return resErr( res, resErrType.duplicateErr, { infoToClient: "Email already exist" } );
        return resErr( res, resErrType.unknownErr, { infoToServer:err } );
    }
}