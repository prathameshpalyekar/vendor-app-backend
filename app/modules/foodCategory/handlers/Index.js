import Joi from 'joi';
import Boom from 'boom';
import async from 'async';
import axios from 'axios';

module.exports = {
    handler: function(request, reply) {
        const { FoodCategory, r } = request.server.plugins.RethinkDb;

        FoodCategory.run().then((categories) => {
            return reply({
                success: true,
                data: categories
            });
        }).catch((err) => {
            return reply(Boom.wrap(err));
        })

    }
};