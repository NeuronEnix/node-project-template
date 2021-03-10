const User = require("../model");
const { resOk, resErr, resErrType } = require( "../../../handler").resHandler;
module.exports = async function signUp( req, res, next ) {    

    try {
        const userDoc = new User();
        Object.assign( userDoc, req.body );
        await userDoc.save()
        return resOk( res );

    } catch ( err ) {
        if( err.code === 11000 ) return resErr( res, resErrType.duplicateErr, { infoToClient: "Email already exist" } );
        return resErr( res, resErrType.unknownErr, { infoToServer:err } );
    }
}