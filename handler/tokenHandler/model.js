const mongoose =  require( "mongoose" );

const tokenSchema = new mongoose.Schema({
    iat: { type: Date, required:true }, //issued at
    uid: { type: mongoose.SchemaTypes.ObjectId, required:true, index:true },
    
}) ;


tokenSchema.methods.concurrentSignInLimiter = function ( maxConcurrentSignInCount ) {
    TokenModel.find({uid:this.uid}).skip( maxConcurrentSignInCount ).sort( {iat:-1} )
        .then( docs => docs.forEach( doc => doc.delete() ) )
}
        
const TokenModel = mongoose.model( "tokens", tokenSchema );
module.exports = TokenModel;
