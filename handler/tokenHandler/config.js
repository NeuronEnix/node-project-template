const TokenModel = require( "./model" );
const { resErr, resErrType } = require( "../resHandler" );

module.exports.maxConcurrentSignInCount = process.env.MAX_CONCURRENT_LOGIN_COUNT || 1;

module.exports.refTok = {

    key: "refTokKey",
    expiresIn: "2d",
    cookieMaxAgeInMS: 2*24*60*60*1000,

    getPayloadUsingTokData: async ( refTokData ) => {
        console.log( "refTok::getPayloadUsingTokData() -> user " )
        console.log( "refTokData: ", refTokData )
        const tokenDoc = await TokenModel.findById( refTokData.tid );
        if ( !tokenDoc ) throw { name: "JsonWebTokenError", info: { infoToServer: new Error( "JsonWebTokenError" ) } };
        return refTokData;
    },
}

module.exports.accTok = {

    key: "accTokKey",
    expiresIn: "1m",
    
    getPayloadUsingTokData: async ( refTokData ) => {
        console.log( "accTok::getPayloadUsingTokData() -> user " )
        console.log( "refTokData: ", refTokData )
        const tokenDoc = await TokenModel.findById( refTokData.tid )
        if ( !tokenDoc ) throw { name: "JsonWebTokenError", info: { infoToServer: new Error( "JsonWebTokenError" ) } };
        
    },
}

// "req.user" will have accTokData
module.exports.hardAuthorizeSequence = async ( req, res, next ) => {
    // Write Query to db and verify
    const doc = await TokenModel.findById( req.user.tid, "iat uid" );
    console.log( doc );
    if( !doc ) return resErr( res, resErrType.unAuthorized );
    console.log( "Hard Authorization: Success" );
    return next();

}

module.exports.tokenErrHandler = ( err, req, res, next ) => {
    let infoToServer = err;
    switch ( err.name ) {
        case 'TokenExpiredError': return resErr( res, resErrType.tokenExpired );
        case "TokenNotFound": // falls through
        case 'JsonWebTokenError': infoToServer = err.message; // falls through
        default: return resErr( res, resErrType.invalidToken,
            { infoToClient: "Please sign in again", infoToServer }
        );
    }
}
