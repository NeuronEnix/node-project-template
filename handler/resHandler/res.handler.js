const util = require("util");
const reqLogger = require( "../reqHandler" );

function logger( res, data ) {
    console.log( "Response:", util.inspect(
        { id: res._log.id, ms:Date.now()-res._log.ts, data },
        { depth:null, colors:true }
    ));
}

function resOk ( res, data ) {
    const resData = { sts:"OK", code:0, data };
    res.status( 200 ).send( resData );
    logger( res, { ...resData } );
};

function resErr ( res, resErrType, {infoToClient, infoToServer} = {} ) {
    const errData = { 
        sts: "ERR", ...resErrType,
        info: infoToClient || "Error occurred, Try again later..."// info to be displayed to client
    };
    res.status( 400 ).send( errData );
    logger( res, { ...errData, infoToServer } );
}

const resErrType = {

    unknownErr  : { code: -1, err: "UnknownError" },
    jsonParseErr: { code: -2, err: "IncorrectJSON" },
    
    unAuthorized    : { code: 1 , err: "NotAuthorized"      },
    resNotFound     : { code: 2 , err: "ResourceNotFound"   },
    dbError         : { code: 3 , err: "DatabaseErr"        },
    validationErr   : { code: 4 , err: "ValidationErr"      },
    invalidCred     : { code: 5 , err: "InvalidCred"        },
    duplicateErr    : { code: 6 , err: "DuplicateErr"       },
    invalidToken    : { code: 7 , err: "InvalidToken"       },
    tokenExpired    : { code: 8 , err: "TokenExpired"       },
    invalidAPI      : { code: 8 , err: "InvalidAPI"         },
}


// uncaught error handler
function uncaughtErrHandler ( err, req, res, next ) {
    // if req data is having incorrectly structured json data
    if( err.type === 'entity.parse.failed' ) {
        // call reqLogger here because in the main.js express.json() will throw the err
        reqLogger( req, res, next ); // which would not run any of the middleware functions and gets redirected here
        return resErr( res, resErrType.jsonParseErr, { infoToClient: "Incorrect JSON" } );
    }

    // No idea what the error is...
    else return resErr( res, resErrType.unknownErr, { infoToServer: err } );
};

module.exports = { resOk, resErr, resErrType, uncaughtErrHandler };