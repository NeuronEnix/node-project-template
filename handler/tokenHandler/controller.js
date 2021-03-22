const jwt = require( "jsonwebtoken" );
const config = require( "./config" );
const TokenModel = require( "./model" );

class Token {
    #key;
    #expiresIn;
    constructor( key, expiresIn ) {
        this.#key = key;
        this.#expiresIn = expiresIn;
    }
    decode( tok ) { return jwt.decode( tok ) };
    sign( payload ) { return jwt.sign( payload, this.#key, { expiresIn: this.#expiresIn } ) };
    verify( tok ) { return jwt.verify( tok, this.#key ) };
}

class AccessToken extends Token {
    constructor( key, expiresIn ) { super( key, expiresIn ); }
}

class RefreshToken extends Token {
    #cookieProperties;
    constructor( key, expiresIn, cookieMaxAge  ) {
        super( key, expiresIn );
        this.#cookieProperties = { maxAge: cookieMaxAge, httpOnly: true, path: "/tok" };
    }
    async sign ( payload = {} ) {
        payload.iat = new Date().getTime();
        const tokDoc = new TokenModel();
        Object.assign( tokDoc, payload );
        await tokDoc.save();
        payload.tid = tokDoc._id;
        const tok = super.sign( payload );
        tokDoc.concurrentSignInLimiter( config.maxConcurrentSignInCount );
        return tok;
    }

    addToCookie( res, tok ) { 
        res.cookie( "refTok", tok, this.#cookieProperties );
    }
}

module.exports.accTok = new AccessToken (
    config.refTok.key,
    config.refTok.expiresIn
);

module.exports.refTok = new RefreshToken(
    config.refTok.key,
    config.refTok.expiresIn,
    config.refTok.cookieMaxAgeInMS
);


module.exports.softAuthorize = ( req, res, next ) => {
    try {
        console.log( "Soft Authorization: In Progress");
        const aTok = req.header( 'Authorization' );
        const accTokData = this.accTok.verify( aTok );
        req.user = accTokData;
        console.log( "Soft Authorization: Success" );
        return next();

    } catch( err ) {
        console.log( "Soft Authorization: Failed" );
        return config.tokenErrHandler( err, req, res, next );
    }
}

module.exports.hardAuthorize = async ( req, res, next ) => {
    try {
        console.log( "Hard Authorization: In Progress");
        const aTok = req.header( 'Authorization' );
        const accTokData = this.accTok.verify( aTok );
        req.user = accTokData;
        return config.hardAuthorizeSequence(req, res, next );

    } catch( err ) {
        console.log( "Hard Authorization: Failed" );
        return config.tokenErrHandler( err, req, res, next );
    }
}

