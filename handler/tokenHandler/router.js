const router = require( 'express' ).Router() ;
const {accTok,refTok} = require( "./controller.js" );

router.get( "/tok/new-acc", ( req, res, next ) => {
    console.log( "Verifying refTok" );
    try {
        const refTokData = refTok.validateTokData( refTok.getData( req.cookies.refTok ) );
        res.status(200).send( { accTok: accTok.getTok( null, refTokData ).tok } );
    } catch ( err ) {
        res.send( err.message );
    }
})
router.get( "/tok/new-ref", ( req, res, next ) => {
    console.log( "Verifying refTok" );
    try {
        const refTokData = refTok.validateTokData( refTok.getData( req.cookies.refTok ) );
        const newRefTok = refTok.getTok( undefined, refTokData );
        refTok.addToCookie( res, newRefTok.tok );
        res.status(200).send( { accTok: accTok.getTok( undefined, newRefTok.data ).tok } );
    } catch ( err ) {
        res.send( err.message );
    }
})

module.exports = router;
