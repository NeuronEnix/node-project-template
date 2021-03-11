const router = require( "express" ).Router();
const controller = require( "./controller" );
const validate = require( "./validation" );

router.post( "/sign-up", validate.signUp, controller.signUp );
router.post( "/sign-in", validate.signIn, controller.signIn  );
// router.post( "/signOut", controller.signOut );

module.exports = router;