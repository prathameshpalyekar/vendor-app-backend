import Joi from 'joi';
import Boom from 'boom';
import async from 'async';
import axios from 'axios';

module.exports = {
    handler: function(request, reply) {
        const { FoodCategory, r } = request.server.plugins.RethinkDb;
        const { payload } = request;
        const { id } = request.params;

        async.auto({
            categories: async.asyncify(() => {
                return FoodCategory.run();
            }),
            category: async.asyncify(() => {
                return FoodCategory.get(id);
            }),
            updateCategory: ['category', (results, next) => {
                const { category } = results;
                if (category) {
                    category.merge(payload).save().then((results) => {
                        next(null, true);
                    }).error(next);
                } else {
                    return next(Boom.badRequest('No such category found.'));
                }
            }],
            updatedCategories: ['updateCategory', (results, next) => {
                FoodCategory.run().then((catergories) => {
                    next(null, catergories);
                }).error(next);
            }]
        }, function(err, results){
            if (err) {
                return reply(err.isBoom ? err : Boom.badRequest(err));
            }

            reply({
                success: true,
                data: results.updatedCategories
            });
        });

    }
};