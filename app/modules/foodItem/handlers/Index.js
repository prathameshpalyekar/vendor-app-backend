import Joi from 'joi';
import Boom from 'boom';
import async from 'async';
import axios from 'axios';

module.exports = {
    handler: function(request, reply) {
        const { FoodItem, r } = request.server.plugins.RethinkDb;

        FoodItem.run().then((items) => {
            return reply({
                success: true,
                data: items
            });
        }).catch((err) => {
            return reply(Boom.wrap(err));
        })
    }
};