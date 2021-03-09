const mongoose = require( "mongoose" );
//Fixes all deprecation warnings
mongoose.set( 'useNewUrlParser'    , true  ) ;
// mongoose.set( 'useFindAndModify'   , false ) ;
// mongoose.set( 'useCreateIndex'     , true  ) ;
mongoose.set( 'useUnifiedTopology' , true  ) ;
// mongoose.set( 'autoIndex'          , true  ) ;

// Importing schema 
// require( './app/user/user.model.js' ) ;

// Connects to DB
module.exports.connectToDatabase = () => {
    mongoose.connect( process.env.DB_URL || "mongodb://127.0.0.1:27017/template" ) 
        .then  ( val => { console.log('Connected to DB' ); } )
        .catch ( err => { console.log('Not Connected to DB', err ); } );
}
