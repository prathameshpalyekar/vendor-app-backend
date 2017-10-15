import Joi from 'joi';
import Boom from 'boom';
import async from 'async';
import axios from 'axios';

module.exports = {
    handler: function(request, reply) {
        const { FoodCategory, r } = request.server.plugins.RethinkDb;
        const { payload } = request;

        async.auto({
            categories: async.asyncify(() => {
                return FoodCategory.run();
            }),
            validate: ['categories', (results, next) => {
                const { categories } = results;
                const isPresentInList = categories.find((category) => category.type === payload.type);

                if (isPresentInList) {
                    return next(Boom.badRequest('Category already present.'));
                }
                next(null, true);
            }],
            addCategory: ['validate', (results, next) => {
                const { validate } = results;
                if (validate) {
                    FoodCategory.save(payload).then((results) => {
                        next(null, true);
                    }).error(next);
                }
            }],
            updatedCategories: ['addCategory', (results, next) => {
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