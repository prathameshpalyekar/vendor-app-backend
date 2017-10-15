// This is restful handler
module.exports = function (server) {

    const { Restful } = server.plugins.RethinkDb;

    class UserRestful extends Restful {
        constructor(options, scopedServer) {
            super('User', options, scopedServer);
        }
    }

    return new UserRestful({
        // setupRoutes: {
        //     except: ['index']
        // }
    }, server);

};
