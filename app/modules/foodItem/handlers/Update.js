import Joi from 'joi';
import Boom from 'boom';
import async from 'async';
import axios from 'axios';

module.exports = {
    handler: function(request, reply) {
        const { FoodItem, r } = request.server.plugins.RethinkDb;
        const { payload } = request;
        const { id } = request.params;

        async.auto({
            foodItems: async.asyncify(() => {
                return FoodItem.run();
            }),
            item: async.asyncify(() => {
                return FoodItem.get(id);
            }),
            updateItem: ['item', (results, next) => {
                const { item } = results;
                if (item) {
                    item.merge(payload).save().then((results) => {
                        next(null, true);
                    }).error(next);
                } else {
                    return next(Boom.badRequest('No such food item found.'));
                }
            }],
            updatedFoodItems: ['updateItem', (results, next) => {
                FoodItem.run().then((items) => {
                    next(null, items);
                }).error(next);
            }]
        }, function(err, results){
            if (err) {
                return reply(err.isBoom ? err : Boom.badRequest(err));
            }

            reply({
                success: true,
                data: results.updatedFoodItems
            });
        });

    }
};