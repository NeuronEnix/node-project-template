const TokenModel = require( "./model" );
// const { } = require( "../../api/user" );
const { resErr, resErrType } = require( "../resHandler" );


module.exports.tokenNotRequiredURL = new Set([
    "/user/sign-in"
])


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

module.exports.hardAuthenticate = ( accTokData, refTok ) => {
    const accTok = req
}

module.exports.isAuthenticated = ( accTokData, refTokData, res ) => {
    console.log( "Validating and authorizing the token -> user" )

    if ( accTokData.tid !== refTokData.tid )
        throw { name: "JsonWebTokenError", info : { infoToServer: new Error( "JsonWebTokenError" ) } }

    res.user = accTokData;

    console.log( res.user )
}

module.exports.tokenErrHandler = ( err, req, res, next ) => {
    const info = err.info || new Error( "JsonWebTokenError" );
    switch ( err.name ) {
        case 'TokenExpiredError': return resErr( res, resErrType.tokenExpired, info  );
        case "TokenNotFound": // falls through
        case 'JsonWebTokenError': // falls through
        default: return resErr( res, resErrType.invalidToken,
            { infoToClient: "Please sign in again", infoToServer: info.infoToServer }
        );
    }
}
