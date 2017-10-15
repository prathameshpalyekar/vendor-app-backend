import Joi from 'joi';
import Boom from 'boom';
import _ from 'lodash';

module.exports = {
    validate: {
        payload: {
            name: Joi.string().required().label('Name'),
            password: Joi.string().required().label('Password')
        }
    },
    auth: {
        mode: 'try'
    },
    handler: function (request, reply) {
        const { User } = request.server.plugins.RethinkDb;

        if (request.auth.isAuthenticated) {
            return reply({
                alreadyLoggedIn: true,
                success: true,
                // User data served from cache
                data: _.pick(request.auth.credentials, ['name', 'id']),
            });
        }

        // FIXME: Currently all fields are visible, withFields is not working 
        // Show only visible fields to user.
        User.filter(function (user) {
            return user('name').match('(?i)^' + request.payload.name + '$');
        }).limit(1).then(function (users) {
            var user = users[0];
            if (user && user.isValidPassword(request.payload.password)) {
                //FIXME: We need a better way to fix this.
                delete user.password;
                //FIXME: Probably session is not preserved between restart
                request.server.app.cache.set(user.id, { user: user }, 0, (err) => {
                    if (err) {
                        return reply(Boom.wrap(err));
                    }

                    // Also set the cookie to be used for subsequent request
                    request.cookieAuth.set({ sid: user.id});

                    return reply({
                        data: _.pick(user, ['name', 'id']),
                        success: true
                    });
                });
            } else {
                return reply(Boom.forbidden('Incorrect Username or password.'));
            }
        });
    }
};
