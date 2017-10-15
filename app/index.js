/**
* Dependencies.
*/
import Glue from 'glue';
import Enviornment from './libs/environment';
import Manifest from './manifest';

// Initialize enviornment
Enviornment();

//
// Manifest dir options
const composeOptions = {
    relativeTo: __dirname
};

Glue.compose(Manifest(), composeOptions, function (err, server) {

    //Start the server
    server.start(function() {
        //Log to the console the host and port info
        server.log(['info'], '=> Server started at ' + server.info.uri);
    });

});
