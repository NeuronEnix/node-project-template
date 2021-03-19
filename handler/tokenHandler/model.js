const mongoose =  require( "mongoose" );

module.exports = mongoose.model( "tokens", new mongoose.Schema({
    iat: { type: Date, required:true }, //issued at
    // other info goes here
    // ...
    uid: { type: mongoose.SchemaTypes.ObjectId, required:true },
}));