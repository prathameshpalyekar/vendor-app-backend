import Hoek from 'hoek';
import Joi from 'joi';

// Declare internals
let internals = {};

internals.register = (server, options, next) => {

    // Expose authentication routes
    server.route([
        {
            method: 'POST',
            path: '/login',
            config: require('./handlers/Login')
        },
        {
            method: 'POST',
            path: '/logout',
            config: require('./handlers/Logout')
        }
    ]);

    // Initialize restful routes
    // require('./handlers/User')(server);


    next();
};


exports.register = function (server, options, next) {

    const sessionTime = 24 * 60 * 60 * 1000;

    // Expires in 3 days as of now.
    const cache = server.cache({
        cache: 'rethinkCache',
        segment: 'auth',
        expiresIn: sessionTime
    });

    server.app.cache = cache;

    options = Hoek.applyToDefaults({
        secret: 'password-should-be-32-characters',
        cookieName: 'cid'
    }, options);

    Joi.validate(options, Joi.object().keys({
        secret: Joi.string().required().min(32),
        cookieName: Joi.string().required()
    }), function (err) {
        if (err) {
            server.log(['error'], err.details[0].message);
        }
    });

    server.auth.strategy('session', 'cookie', 'try', {
        password: options.secret,
        ttl: sessionTime,
        cookie: options.cookieName,
        keepAlive: true,
        redirectTo: false,
        isSecure: false,
        clearInvalid: true,
        validateFunc: function (request, session, callback) {
            cache.get(session.sid, (err, cached) => {

                if (err) {
                    return callback(err, false);
                }

                if (!cached) {
                    return callback(null, false);
                }

                return callback(null, true, cached.user);
            });
        }
    });

    server.dependency(['RethinkDb'], internals.register(server, options, () => {
        // We will implement things like welcome email,
        // forgot password email etc in hooks/ folder
        // Reason being that with this we can later, in future separate the 
        // hook based functionalities to altogether different hapi server/code base
        require('./hooks/WelcomeEmail')(server.plugins.RethinkDb);

        // continue
        return next();
    }));
};

exports.register.attributes = {
    name: 'Authentication'
};
