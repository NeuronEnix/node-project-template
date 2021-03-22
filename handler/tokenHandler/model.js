const mongoose =  require( "mongoose" );

module.exports = mongoose.model( "tokens", new mongoose.Schema({
    iat: { type: Date, required:true }, //issued at
    uid: { type: mongoose.SchemaTypes.ObjectId, required:true },
    
}));