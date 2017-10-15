import Joi from 'joi';
import Boom from 'boom';
import async from 'async';
import axios from 'axios';

module.exports = {
    handler: function(request, reply) {
        const { User, r } = request.server.plugins.RethinkDb;
        const { name, password, admin } = request.payload;
        // const { id } = request.query;

        if(!name) {
            return reply(Boom.forbidden('Please provide username.'));
        }

        if(!password) {
            // if(!query) {
                return reply(Boom.forbidden('Please provide password.'));
            // }
        }

        User.save(request.payload).then((user) => {
            return reply({
                success: true,
                data: user
            });
        }).catch((err) => {
            return reply(Boom.wrap(err));
        })

    }
};