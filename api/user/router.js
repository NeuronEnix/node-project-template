const router = require( "express" ).Router();
const controller = require( "./controller" );
const validate = require( "./validation" );

router.post( "/signUp", validate.signUp, controller.signUp );
router.post( "/signIn",  controller.signIn  );
// router.post( "/signOut", controller.signOut );

module.exports = router;