const jwt = require( "jsonwebtoken" );
const config = require( "./config" );

class Token {
    #key;
    #expiresIn;
    constructor( key, expiresIn ) {
        this.#key = key;
        this.#expiresIn = expiresIn;
    }
    getData( tok ) {
        if ( !tok ) throw { name: "TokenNotFound", errObj: new Error( "TokenNotFound" ) } ;
        const tokData = jwt.verify( tok, this.#key );
        delete tokData.iat;
        delete tokData.exp;
        delete tokData.nbf;
        delete tokData.jti;
        return tokData;
    }
    getTok( payload ) {
        return { data:payload, tok: jwt.sign( payload, this.#key, { expiresIn: this.#expiresIn } ) };
    }
}

class AccessToken extends Token {
    constructor( key, expiresIn ) { super( key, expiresIn ); }
    getTok( payload, refTokData ) { 
        return super.getTok( payload ? payload : config.refTok.getPayloadUsingTokData( refTokData ) )
    }
}

class RefreshToken extends Token {
    #cookieProperties;
    constructor( key, expiresIn, cookieMaxAge  ) {
        super( key, expiresIn );
        this.#cookieProperties = { maxAge: cookieMaxAge, httpOnly: true };
    }
    getTok( payload, refTokData ) { 
        if( !payload ) payload = config.refTok.getPayloadUsingTokData( refTokData );
        payload.tid = "tok_id";
        return super.getTok( payload );
    }
    validateTokData( tokData ) { console.log( "Validating refTok"); return tokData; }
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

module.exports.authorizer = ( req, res, next ) => {
    console.log( "Authorizing...");
    try {
        accTokData = this.accTok.getData( req.header( 'Authorization' ) );
        refTokData = this.refTok.getData( req.cookies.refTok );
        config.validateAndAuthorizeToken( accTokData, refTokData, res );
        console.log( "Authorized");
        next();
    } catch ( err ) {
        if ( config.tokenNotRequiredURL.has( req.url ) ) return next();
        return config.tokenErrHandler( err, req, res, next );
    }
}