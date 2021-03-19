const bcrypt = require( "bcrypt" );

const UserModel = require("../model");
const { resOk, resErr, resErrType } = require( "../../../handler").resHandler;
const { accTok, refTok } = require( "../../../handler" ).tokenHandler

module.exports = async function signIn( req, res, next ) {    

    try {
        const { email, pass } = req.body;
        const userDoc = await UserModel.findOne( { email }, { _id:1, name:1, pass:1} )

        // if email and pass didn't match
        if ( !userDoc ) return resErr( res, resErrType.invalidCred, { infoToClient: "Email or Password Incorrect" } );
        else if ( await bcrypt.compare( pass, userDoc.pass ) === false ) { // check if the pass match
            return resErr( res, resErrType.invalidCred, { infoToClient: "Email or Password is incorrect" } );
        }
        console.log( refTok.getTok( { uid: userDoc._id } ) );
        // refTok.addToCookie( res,  );
        return resOk( res, {_id: userDoc._id, name: userDoc.name} );
    } catch ( err ) {
        return resErr( res, resErrType.unknownErr, { infoToServer:err } );
    }
}