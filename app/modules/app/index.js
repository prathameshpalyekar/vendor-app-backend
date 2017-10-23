//import Hoek from 'hoek';
//import Joi from 'joi';
import Handlebars from 'handlebars';
import _ from 'lodash';

// Declare internals
let internals = {};

internals.register = (server, options, next) => {

    server.views({
        engines: {
            html: Handlebars
        }
    });

    let htmlHandler = {
        auth: {
            mode: 'try',
            strategy: 'session'
        },
        handler: function (request, reply) {
            const { credentials } = request.auth;
            const { User } = request.server.plugins.RethinkDb;
            //const { cache } = request.server.app;

            if (!credentials) {
                return reply.view('app/views/index.html', {
                    user: 'null'
                });
            }

            User.get(credentials.id).then((user) => {
                reply.view('app/views/index.html', {
                    user: JSON.stringify(_.pick(user, [
                        'id',
                        'name',
                        'email'
                    ]))
                });
            }).catch(() => {
                return reply.view('app/views/index.html', {
                    user: 'null'
                });
            });
            // cache.get(credentials.id, (err, cached) => {
            //
            //     if (err || !cached) {
            //         return reply.view('app/views/index.html', {
            //             user: 'null'
            //         });
            //     }
            //
            //     reply.view('app/views/index.html', {
            //         user: JSON.stringify(cached.user)
            //     });
            // });
        }
    };

    // Expose authentication routes
    server.route([
        {
            method: 'GET',
            path: '/assets/{param*}',
            handler: {
                directory: {
                    path: 'assets'
                }
            }
        },{
            method: 'GET',
            path: '/bills/{param*}',
            handler: {
                directory: {
                    path: 'bills'
                }
            }
        },
        {
        	method: 'GET',
            path: '/favicon.ico',
            handler: function (request, reply) {
                reply.file('/favicon.ico');
            }
        },
        {
            method: 'GET',
            path: '/',
            config: htmlHandler
        },
        {
            method: 'GET',
            path: '/{_first}',
            config: htmlHandler
        },
        {
            method: 'GET',
            path: '/{_first}/{_second}',
            config: htmlHandler
        },
        {
            method: 'GET',
            path: '/{_first}/{_second}/{void*}',
            config: htmlHandler
        },
        {
            method: 'GET',
            path: '/static/{param*}',
            handler: {
                directory: {
                    path: 'static'
                }
            }
        }
    ]);

    next();
};


exports.register = function (server, options, next) {

    server.dependency(['vision'], internals.register(server, options, () => {
        // continue
        return next();
    }));
};

exports.register.attributes = {
    name: 'App'
};
