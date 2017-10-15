import Joi from 'joi';
import Boom from 'boom';
import async from 'async';
import axios from 'axios';

module.exports = {
    handler: function(request, reply) {
        const { FoodItem, r } = request.server.plugins.RethinkDb;
        const { payload } = request;

        async.auto({
            foodItems: async.asyncify(() => {
                return FoodItem.run();
            }),
            validate: ['foodItems', (results, next) => {
                const { foodItems } = results;
                const isPresentInList = foodItems.find((item) => item.code === payload.code || item.name === payload.name);

                if (isPresentInList) {
                    return next(Boom.badRequest('Food item already present.'));
                }
                next(null, true);
            }],
            addItem: ['validate', (results, next) => {
                const { validate } = results;
                if (validate) {
                    FoodItem.save(payload).then((results) => {
                        next(null, true);
                    }).error(next);
                }
            }],
            updatedFoodItems: ['addItem', (results, next) => {
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