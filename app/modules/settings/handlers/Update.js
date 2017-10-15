import Joi from 'joi';
import Boom from 'boom';
import async from 'async';
import axios from 'axios';

module.exports = {
    handler: function(request, reply) {
        const { User, r } = request.server.plugins.RethinkDb;
        const { name, password, admin } = request.payload;
        const { id } = request.params;

        if(!name) {
            return reply(Boom.forbidden('Please provide username.'));
        }

        if(!password) {
            // if(!query) {
                return reply(Boom.forbidden('Please provide password.'));
            // }
        }

        async.auto({
            user: async.asyncify(() => {
                return User.get(id); //.getJoin({company: true});
            }),
            updateUser: ['user', function(results, next){
                const { user } = results;
                
                user.merge(request.payload).save().then((updatedUser) => {
                    next(null, updatedUser);
                }).error(next);

            }]
        }, function(err, results){
            if (err) {
                return reply(err.isBoom ? err : Boom.badRequest(err));
            }

            reply({
                success: true,
                data: results.updateUser
            });
        });

    }
};