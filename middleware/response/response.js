const util = require("util");
const reqLogger = require( "../requestLogger" );

function logger( res, data ) {
    console.log( "Response:", util.inspect(
        { id: res._log.id, ms:Date.now()-res._log.ts, data },
        { depth:null, colors:true }
    ));
}

function resOk ( res, data ) {
    const resData = { code:0, sts:"OK", data };
    res.status( 200 ).send( resData );
    logger( res, { ...resData } );
};

function resErr ( res, errObj, {infoToClient, infoToServer} = {} ) {
    infoToClient = infoToClient || "Error occurred, Try again later..."; // default info if non is provided ( to be displayed to client )
    const errData = { info: infoToClient, ...errObj, sts: "ERR" };
    res.status( 400 ).send( errData );
    logger( res, { ...errData, infoToServer } );
}

const resErrObj = {

    unknownErr  : { code: -1, msg: "Some Error Occurred..." },
    jsonParseErr: { code: -2 , msg: 'Incorrect JSON Structure' },
    
    unAuthorized        : { code: 1 , msg: 'Not Authorized'                     },
    resNotFound         : { code: 2 , msg: 'Resource Not Found'                 },
    dbError             : { code: 3 , msg: 'Database Error'                     },
    validationErr       : { code: 4 , msg: 'Validation Error'                   },
    invalidCredential   : { code: 5 , msg: 'Incorrect Credential'               },
    duplicateErr        : { code: 6 , msg: 'Value Already Exist (Duplicate)'    },
    invalidToken        : { code: 7 , msg: 'Invalid Token'                      },
    tokenExpired        : { code: 8 , msg: 'Access Token Expired'               },
    invalidAPI          : { code: 8 , msg: 'Invalid API'                        },
}


// uncaught error handler
function uncaughtErrHandler ( err, req, res, next ) {

    // if req data is having incorrectly structured json data
    if( err.type === 'entity.parse.failed' ) {
        // call reqLogger here because in the main.js express.json() will throw the err
        reqLogger( req, res, next ); // which would not run any of the middleware functions and gets redirected here
        return resErr( res, resErrObj.jsonParseErr, { infoToClient: "Incorrect JSON" } );
    }

    // No idea what the error is...
    else return resErr( res, resErrObj.unknownErr, { infoToServer: err } );
};

module.exports = { resOk, resErr, resErrObj, uncaughtErrHandler };