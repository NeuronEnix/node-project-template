let GoogleStrategy = require( "passport-google-oauth20" ).Strategy;

module.exports = function ( passport ) {
    passport.use( 
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: "http://localhost:8080/google/callback"
            },
            ( accTok, refTok, profile, done ) => {
                console.log( "CCCCCCCCCCCCCCCCCCallback");
                console.log( profile );
                console.log( "Callback kkkkkkkkkk");
                console.log( {accTok, refTok} );
                done( null, {
                    id: profile.id,
                    name: profile.displayName
                })                
            }
        )
    )

    passport.serializeUser( function ( user, done ) {
        console.log( "Serializing User" );
        console.log( "user:", user );
        done( null, user.id );
    })

    passport.deserializeUser( function ( id, done ) {
        console.log( "Deserializing user")
        console.log( "id: ", id );
        done( null, {
            id:"user123",
            name:"custom"
        });
    })
    

}
