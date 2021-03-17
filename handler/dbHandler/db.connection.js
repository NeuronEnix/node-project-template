const mongoose = require( "mongoose" );
//Fixes all deprecation warnings
mongoose.set( 'useNewUrlParser'    , true  ) ;
// mongoose.set( 'useFindAndModify'   , false ) ;
mongoose.set( 'useCreateIndex'     , true  ) ;
mongoose.set( 'useUnifiedTopology' , true  ) ;
// mongoose.set( 'autoIndex'          , true  ) ;

// Importing schema 
// require( './app/user/user.model.js' ) ;

// Connects to DB
module.exports.connectToDatabase = () => {
    mongoose.connect( "mongodb+srv://aaa:aaa@neuron.hfbmi.mongodb.net/test" ) 
        .then  ( val => { console.log('Connected to DB' ); } )
        .catch ( err => { console.log('Not Connected to DB', err ); } );
}
