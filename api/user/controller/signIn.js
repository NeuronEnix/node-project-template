const bcrypt = require( "bcrypt" );

const UserModel = require("../model");
const { resOk, resErr, resErrType } = require( "../../../handler").resHandler;
const { accTok, refTok } = require( "../../../handler" ).tokenHandler

module.exports = async function signIn( req, res, next ) {    

    try {
        const { email, pass } = req.body;
        const userDoc = await UserModel.findOne( { email }, { _id:1, name:1, pass:1 } )

        // if user not found or pass is incorrect
        if ( !userDoc || await bcrypt.compare( pass, userDoc.pass ) === false )
            return resErr( res, resErrType.invalidCred, { infoToClient: "Email or Password Incorrect" } );

        const refTokPayload = { uid: userDoc._id };
        
        const rTok = await refTok.sign( refTokPayload );
        refTok.addToCookie( res, rTok );

        const { tid, iat } = refTok.decode( rTok );

        const accTokPayload = {
            uid: userDoc._id,
            tid, tat:iat
        }
        
        return resOk( res, { accTok : accTok.sign( accTokPayload ) } );
        
    } catch ( err ) {
        return resErr( res, resErrType.unknownErr, { infoToServer:err } );
    }
}
/*
Sign In
-----------------------------------------------

////////////////////////////////////////////////

Athorizing
-----------------------------------------------
app.use( softAuthorize );
app.use( hardAuthorize );

////////////////////////////////////////////////

Token Routing
-----------------------------------------------
app.use( Token.router );

router.use( "/tok", hardAuthorizeUsingRefTok,  )

router.get( "/new-ref", (r,r,n) => {
    
    RefreshToken.getTok( Token.getPayload( errType ) );

})

*/
