const { resErr, resErrType } = require( "../resHandler" );
module.exports.validate = ( res, next, schema, data ) => {
    schema.validateAsync( data )
        .then( val => next() )
        .catch( err => resErr( res, resErrType.validationErr, { infoToClient: err.details[0].message } ) )
};

