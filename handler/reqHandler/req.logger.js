let reqID = 0;

module.exports.reqLogger = function( req, res, next ) {

    res._log = {
        id: ++reqID,
        ts: Date.now() // timestamp
    }

    console.log( 
        "\n\nRequest:", 
        {
            ip: req.ip,
            id: res._log.id,
            url: req.url,
            method: req.method,
            body: req.body,
            query: req.query
        }
    );
    
    return next();
}